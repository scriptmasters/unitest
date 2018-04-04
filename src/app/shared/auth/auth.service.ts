
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';



@Injectable()
export class AuthService {
    authLoginUrl = 'http://vps9615.hyperhost.name:443/api/login/index/';
    authLogoutUrl = 'http://vps9615.hyperhost.name:443/api/login/logout';
    rgxpStudent = /^\/student.*/g;
    rgxpAdmin = /^\/admin.*/g;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };
    loginResponse: any;


    constructor(private http: HttpClient, private router: Router ) {}


    login(username, password, redirectUrl) {
        let authData = {'username': username, 'password': password};
        this.http.post(this.authLoginUrl, authData, this.httpOptions)
                   .subscribe(data => { this.loginResponse = data;
                       switch (this.loginResponse.roles[1]) {
                           case 'admin' :
                               if (this.rgxpAdmin.test(redirectUrl)) {
                                   this.router.navigate([redirectUrl]);
                               } else {
                                   this.router.navigate(['/admin']);
                               }
                               break;

                           case 'student' :
                               if (this.rgxpStudent.test(redirectUrl)) {
                                   this.router.navigate([redirectUrl]);
                               } else {
                                   this.router.navigate(['/student']);
                               }
                               break;
                       }

                   }, error => document.getElementById('error').innerHTML = error.error.response
                   );
    }

    logout(): void {
        this.http.get(this.authLogoutUrl)
            .subscribe(undefined, undefined, () => {
                this.router.navigate(['/login']);
            });
    }
}
