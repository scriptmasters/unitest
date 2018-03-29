
import {Injectable, NgModule} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
    authLoginUrl = 'http://vps9615.hyperhost.name:443/api/login/index/';
    authLogoutUrl = 'http://vps9615.hyperhost.name:443/api/login/logout';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    auth = {
        'username': undefined,
        'password': undefined,
        'confirm-password': undefined
    };
    response: any = {};

    constructor(private http: HttpClient, private router: Router) {}
    // store the URL so we can redirect after logging in
    redirectUrl: string;

    login(username, password, confirm_password) {
        this.auth.username = username;
        this.auth.password = password;
        this.auth['confirm-password'] = confirm_password;
        this.http.post(this.authLoginUrl, this.auth, this.httpOptions)
                   .subscribe(data => this.response = data,
                              () => {
                                   document.getElementById('error').style.display = 'visible';
                                   document.getElementById('error').innerText = 'Wrong username or password'; },
                              () => {
                       if (this.response.roles[1] === 'admin') {this.router.navigate(['/admin']); } else {
                           if (this.response.roles[1] === 'student') {this.router.navigate(['/student']); }
                       }

                   } );
    }

    logout(): void {
        this.http.get(this.authLogoutUrl);
        this.router.navigate(['/login']);
    }
}
