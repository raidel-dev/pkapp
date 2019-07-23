import { HttpHeaders, HttpParams } from '@angular/common/http';

export class CustomParamsWithResponse {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe: 'response';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

export class CustomParamsWithBody {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}