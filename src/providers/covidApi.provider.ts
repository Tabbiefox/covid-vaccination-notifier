import { ICovidApiConfig } from '../config';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, retry } from 'rxjs/operators';
import { CovidData, CovidDataItem, CovidApiData } from '../models';
import { XMLHttpRequest } from 'xmlhttprequest';

/**
 * Covid API Provider
 */
export class CovidApiProvider {

    private config: ICovidApiConfig;

    private data: CovidData;

    private apiData: CovidApiData;


    constructor(config: ICovidApiConfig) {
        this.config = config;
    }

    public getCurrentData(): CovidData {
        return this.data;
    }

    public getCurrentApiData(): CovidApiData {
        return this.apiData;
    }

    public getDataObservable(): Observable<CovidData> {
        function createXHR() {
            return new XMLHttpRequest()
        }
        return ajax({
            createXHR,
            url: this.config.url,
            crossDomain: true,
            responseType: "json",
            timeout: this.config.timeout,
        }).pipe(
            map(data => {
                this.apiData = data.response as CovidApiData;
                let items: CovidDataItem[] = [];
                if (this.apiData && 'payload' in this.apiData && this.apiData.payload.length > 0) {
                    Array.from(this.apiData.payload).forEach(x => {
                        let item: CovidDataItem = {
                            name: x.title,
                            street: x.street_name ? x.street_name + ' ' + (x.street_number ? x.street_number : '') : null,
                            city: x.city ? x.city : null,
                            zip: x.postal_code ? x.postal_code : null,
                            region: x.region_name ? x.region_name : null,
                            freeCapacity: x.calendar_data.map(a => a.free_capacity).reduce((a, b) => a + b, 0),
                            ageFrom: x.age_from ? parseInt(x.age_from) : null,
                            ageTo: x.age_to ? parseInt(x.age_to) : null
                        }
                        items.push(item);
                    });
                }
                this.data = {
                    lastUpdate: new Date(),
                    items: items
                }
                console.log('CovidApiProvider: (' + new Date().toUTCString() + ') Loaded new data from API with ' + this.data.items.map(x => x.freeCapacity).reduce((a, b) => a + b, 0) + ' free spots.');
                return this.data;
            }),
            retry(this.config.retries),
            catchError(error => {
                console.error('CovidApiProvider: Ajax error', (!!error && 'xhr' in error && 'responseText' in error.xhr ? error.xhr.responseText : error));
                return of(error);
            })
        );
    }
}
