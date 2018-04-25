import { Injectable} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    constructor() { }
    hostName = 'http://vps9615.hyperhost.name:443/api/';
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const httpReq = req.clone({ url: this.hostName + req.url});

        return next.handle(httpReq);

    }
}
