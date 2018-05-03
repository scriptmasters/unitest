import {Injectable} from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {IisLogged} from './shared/Interfaces/server_response';

@Injectable()
export class StudentGuard implements CanActivate {
    constructor(private router: Router, private http: HttpClient) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        const authStatusUrl = 'login/isLogged';

        return this.http.get(authStatusUrl)
            .map((data: IisLogged) => {
                if (data.response === 'logged' && data.roles[1] === 'student') {
                    return true;
                } else {
                    this.router.navigate(['/login'], {
                        queryParams: {
                            return: state.url
                        }
                    });
                    return false;
                }
            });
    }
}
