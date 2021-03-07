import { IClickatellApiConfig } from '../config';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { commit } from '../helpers/rxjs.helper';
import { XMLHttpRequest } from 'xmlhttprequest';

/**
 * Clickatell API Provider
 */
export class ClickatellApiProvider {

    private config: IClickatellApiConfig;


    constructor(config: IClickatellApiConfig) {
        this.config = config;
    }

    public sendMessage(phoneNumber: string, message: string): Observable<any> {
        function createXHR() {
            return new XMLHttpRequest()
        }
        if (!this.config.apiKey || !phoneNumber || !message)
            return

        let url = 'https://platform.clickatell.com/messages/http/send?apiKey=' + this.config.apiKey + '&to=' + phoneNumber.replace('+', '') + '&content=' + message.replace(' ', '+');

        return ajax({
            createXHR,
            url,
            crossDomain: true,
            responseType: "json"
        }).pipe(
            map(data => {
                let response = data.response;
                console.log('ClickatellApiProvider: Sent message', response)
                return response;
            }),
            catchError(error => {
                console.error('ClickatellApiProvider: Ajax error', (!!error && 'xhr' in error && 'responseText' in error.xhr ? error.xhr.responseText : error));
                return of(error);
            }),
            commit()
        );
    }
}
