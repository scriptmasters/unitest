import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StudentGuard implements CanActivate {
    constructor( private router: Router, private http: HttpClient ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        const authStatusUrl = 'http://vps9615.hyperhost.name:443/api/login/isLogged';
        const promise = new Promise((resolve, reject) => {
            this.http.get(authStatusUrl)
                .subscribe((data: any) => {
                        if (data.response === 'logged' && data.roles[1] === 'student') {
                            resolve('student');
                        } else {
                            resolve('not student');
                        }
                });
        });

        return promise.then(
            result => {
                switch (result) {
                    case 'student' :
                        return true;
                    case 'not student' :
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
