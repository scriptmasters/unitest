import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {
    authLoginUrl = 'login/index/';
    authLogoutUrl = 'login/logout';
    isLoggedUrl = 'login/isLogged';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient, private router: Router) {}

    login(authData): Observable<Object> {
        return this.http.post(this.authLoginUrl, authData, this.httpOptions);
    }

    logout(): void {
        this.http.get(this.authLogoutUrl)
            .subscribe(undefined, undefined, () => {
                this.router.navigate(['/login']);
            });
    }

    isLogged(): Observable<Object> {
            return this.http.get(this.isLoggedUrl);
    }
}
