import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import {AuthService} from './shared/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import {publishReplay} from 'rxjs/operator/publishReplay';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private http: HttpClient ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        const rgxpStudent = /^\/student.*/g;
        const rgxpAdmin = /^\/admin.*/g;


        const authStatusUrl = 'http://vps9615.hyperhost.name:443/api/login/isLogged';
        let authStatus: any = {
            response: undefined,
            roles: [undefined]
        };


        const promise = new Promise((resolve, reject) => {
            this.http.get(authStatusUrl)
                    .subscribe((data) => {
                        authStatus = data;
                        if (authStatus.response === 'logged') {
                                if (authStatus.roles[1] === 'student') {
                                    resolve('student');
                                } else { if (authStatus.roles[1] === 'admin') {
                                    resolve('admin'); }
                                }
                            } else {resolve ('non logged'); }
                        }
                    );
            }
        );


    return promise.then(
        result => {
            switch (result) {
                case 'student' :
                    if (rgxpStudent.test(state.url)) {
                        return true;
                    } else {
                        this.router.navigate(['/login'], {
                            queryParams: {
                                return: state.url
                            }
                        });
                        return false;
                    }
                case 'admin' :
                    if (rgxpAdmin.test(state.url)) {
                        return true;
                    } else {this.router.navigate(['/login'], {
                        queryParams: {
                            return: state.url
                        }
                    });
                        return false;
                    }
                case 'non logged' :
                    this.router.navigate(['/login'], {
                        queryParams: {
                            return: state.url
                        }
                    });
                    return false;
            }
        }
    );
    }
}
