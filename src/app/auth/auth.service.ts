
import {Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class AuthService {
    authUrl = 'http://vps9615.hyperhost.name:443/api/login/index/';
    authStatusUrl = 'http://vps9615.hyperhost.name:443/api/login/isLogged';
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };
    authStatus: any = {
        'roles': [undefined, undefined],
        'id': undefined,
        'username': undefined,
        'response': undefined
    };
    auth = {
        'username': 'login',
        'password': 'password',
        'confirm-password': 'password'
    };
    response: any = {};


    constructor(private http: HttpClient) {
    }
    authStatusGet() {
        this.http.get(this.authStatusUrl)
            .subscribe(data => this.authStatus = data);

    }
    showAuth(username, password, confirm_password) {
        this.auth.username = username;
        this.auth.password = password;
        this.auth['confirm-password'] = confirm_password;
        this.http.post(this.authUrl, this.auth, this.httpOptions)
                .subscribe(data => this.response = data, undefined, () => this.authStatusGet());
/*return this.response;*/
    }

}
