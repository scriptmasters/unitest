import { Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import 'rxjs/add/operator/do';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    hostName = 'http://vps9615.hyperhost.name:443/api/';

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const httpReq = req.clone({url: this.hostName + req.url, reportProgress: true});

        return next.handle(httpReq)
            .catch((error) => {
                if (error.status === 403 && error.error.response.indexOf('logged') !== -1) {
                    this.router.navigate(['/login'], {
                            queryParams: {return: this.router.url.split('?')[0]}
                        }
                    );
                }

                return Observable.throw(error);
            }) as any;
    }
}
