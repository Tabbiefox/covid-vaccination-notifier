import { ICovidApiConfig } from '../config';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { equals } from '../helpers'
import { CovidDataItem, CovidApiData } from '../models';
import { XMLHttpRequest } from 'xmlhttprequest';

/**
 * Covid API Provider
 */
export class CovidApiProvider {

    private config: ICovidApiConfig;


    constructor(config: ICovidApiConfig) {
        this.config = config;
    }

    public getData(): Observable<CovidDataItem[]> {
        function createXHR() {
            return new XMLHttpRequest()
        }
        return ajax({
            createXHR,
            url: this.config.covidApiUrl,
            crossDomain: true,
            responseType: "json"
        }).pipe(
            map(data => {
                let response = data.response as CovidApiData;
                let list: CovidDataItem[] = [];
                if (response && 'payload' in response && response.payload.length > 0) {
                    Array.from(response.payload).forEach(x => {
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
                        if (item.freeCapacity > 0)
                            list.push(item);
                    });
                }
                return list;
            }), catchError(error => {
                console.error('CovidApiProvider: Ajax error', (!!error && 'xhr' in error && 'responseText' in error.xhr ? error.xhr.responseText : error));
                return of(error);
            })
        );
    }
}
