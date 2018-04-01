import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import {AuthService} from './shared/auth/auth.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private http: HttpClient ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let url: string = state.url;
        const rgxpStudent = /^\/student.*/g;
        const rgxpAdmin = /^\/admin.*/g;


        const authStatusUrl = 'http://vps9615.hyperhost.name:443/api/login/isLogged';
        let authStatus: any = {
            response: undefined,
            roles: [undefined]
        };

        let promise = new Promise((resolve, reject) => {
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
                    if (rgxpStudent.test(url)) {
                        return true;
                    } else {
                        console.log('student, wrong page');
                        this.authService.redirectUrl = url;
                        this.router.navigate(['/login']);
                        return false;
                    }
                case 'admin' :
                    if (rgxpAdmin.test(url)) {
                        return true;
                    } else {
                        this.authService.redirectUrl = url;
                        this.router.navigate(['/login']);
                        return false;
                    }
                case 'non logged' :
                    this.authService.redirectUrl = url;
                    this.router.navigate(['/login']);
                    return false;
            }
        }
    );
    }
}
