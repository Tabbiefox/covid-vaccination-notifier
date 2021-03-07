import { config } from './config';
import * as App from './app';

/**
 * Asynchronous application bootstrap
 */
export async function init() {
    try {
        // Instantiate and register app services
        App.initServices(config);

        // Instantiate and configure web server
        const server = App.initServer(config);
        App.initServerRoutes(server);
        App.initServerErrorHandler(server);

        // Start web server
        server.listen(Number(config.port) || 8080, config.host || 'localhost');

        // Start Covid Notification service
        const covidNotificationService = App.getServices().covidNotification;

        // Hook Clickatell API to the Covid service change observable
        covidNotificationService.getNotificationObservable().subscribe((notification) => {
            let message = '[COVID-VAC] ' + notification.freeCapacity + ' free spots in ' + (notification.city ? notification.city : notification.region + ' region') + ' for age ' + notification.age + '.';
            App.getProviders().clickatellApi.sendMessage(
                notification.phoneNumber,
                message
            );
            console.log(
                '[NOTIFICATION] ' +
                '(' + notification.lastNotificationDate.toUTCString() + ') ' +
                notification.phoneNumber + ': ' + message
            );
        });

        // Start Covid Notificatino Service
        covidNotificationService.start();

    }
    catch(e) {
        console.log(e, 'An error occured while initializing application');
    }
}

init();