import { ICovidNotificationConfig, ICovidNotificationItemConfig } from '../config';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { switchMap, retry, repeat } from 'rxjs/operators';
import { CovidData, CovidDataItem, CovidNotificationItem } from '../models';
import { getProviders } from '../app';

/**
 * Covid Notification Service
 * Periodically pools for Covid API updates and emits changes
 */
export class CovidNotificationService {

    private config: ICovidNotificationConfig;

    private dataSubscription: Subscription;

    private notifications: CovidNotificationItem[];

    private notificationSubject: Subject<CovidNotificationItem>;


    constructor(config: ICovidNotificationConfig) {
        this.config = config;
        this.notifications = this.getNotificationsFromConfig(this.config.notifications);
        this.notificationSubject = new Subject<CovidNotificationItem>();
    }

    public start(): CovidNotificationService {
        this.dataSubscription = this.getDataPollingObservable().subscribe((data) => {
            this.updateNotifications(data);
        });

        return this;
    }

    public stop() {
        this.dataSubscription.unsubscribe();
    }

    public getNotificationObservable(): Observable<CovidNotificationItem> {
        return this.notificationSubject.asObservable();
    }

    private getNotificationsFromConfig(config: ICovidNotificationItemConfig[]): CovidNotificationItem[] {
        return Array.from(config)
            .filter(x => {
                return ((x.city || x.region) && x.age && x.phoneNumber)
            })
            .map(x => {
                return {
                    city: x.city ?? null,
                    region: x.region && !x.city ? x.region : null,
                    age: x.age,
                    phoneNumber: x.phoneNumber,
                    lastNotificationDate: null,
                    freeCapacity: 0,
                    freeCapacityDate: null
                };
            });
    }

    private updateNotifications(data: CovidData) {
        if (!data || !data.items || !data.items.length)
            return;

        let currentDate = new Date();
        this.notifications = this.notifications.map(notification => {
            let lastFreeCapacity = notification.freeCapacity;
            notification.freeCapacityDate = currentDate;
            notification.freeCapacity = data.items.filter(x => {
                return ((!x.ageFrom || x.ageFrom <= notification.age)
                    && (!x.ageTo || x.ageTo >= notification.age)
                    && x.freeCapacity > 0
                    && (
                        (notification.city && x.city.toLocaleLowerCase() == notification.city.toLocaleLowerCase())
                        || (notification.region && x.region.toLocaleLowerCase() == notification.region.toLocaleLowerCase())
                    ));
                }).map(x => x.freeCapacity).reduce((a, b) => a + b, 0);

            if (
                (!notification.lastNotificationDate || !lastFreeCapacity || notification.lastNotificationDate.getTime() + this.config.messageTimeout < currentDate.getTime())
                && notification.freeCapacity > lastFreeCapacity
            ) {
                notification.lastNotificationDate = currentDate;
                this.notificationSubject.next(notification);
            }
            return notification;
        });
    }

    private getDataPollingObservable(): Observable<CovidData> {
        return timer(0, this.config.pollingInterval).pipe(
            switchMap(tick => getProviders().covidApi.getDataObservable()),
            repeat()
        );
    }
}