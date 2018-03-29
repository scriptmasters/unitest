import {Injectable, NgModule} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import {AuthService} from './shared/auth/auth.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        let authStatusUrl = 'http://vps9615.hyperhost.name:443/api/login/isLogged';
        let authStatus: any = {
            'roles': [undefined, undefined],
            'id': undefined,
            'username': undefined,
            'response': undefined
        };
        let status: string;

        this.http.get(authStatusUrl)
            .subscribe(data =>  authStatus = data, undefined, () => {
                if (authStatus.response === 'logged') {
                    if (authStatus.roles[1] === 'student') {
                        if (status === 'student') {
                            return status = 'student';
                        }
                    } else {
                        return status = 'admin';
                    }
                } else {
                    return status = 'non logged';
                }
            }

            );






        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;

        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return true;
    }

}