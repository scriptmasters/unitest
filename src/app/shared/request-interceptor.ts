import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import 'rxjs/add/operator/do';
import {PaginationService} from './pagination/pagination.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    httpReq;
    constructor(private router: Router,
                private pagService: PaginationService) {
    }

    hostName = 'http://vps9615.hyperhost.name:443/api/';

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.includes('i18n')) {
        this.httpReq = req.clone({url: `${this.hostName}${req.url}`});
        } else {
            this.httpReq = req.clone({url: `${req.url}`});
        }
        return next.handle(this.httpReq)
            .do((response) => {
                if (response.type === 0) {
                    this.pagService.increaseReqCount();
                }
                if (response instanceof HttpResponse) {
                    this.pagService.decreaseReqCount();
                }
            })
            .catch((error) => {
                if (error) {
                    this.pagService.decreaseReqCount();
                }
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
