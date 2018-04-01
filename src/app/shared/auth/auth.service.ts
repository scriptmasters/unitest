
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

    auth = {
        'username': undefined,
        'password': undefined,
    };

    redirectUrl: string;

    constructor(private http: HttpClient, private router: Router ) {}


    login(username, password) {
        this.auth.username = username;
        this.auth.password = password;
        this.http.post(this.authLoginUrl, this.auth, this.httpOptions)
                   .subscribe(data => {
                       let response: any = data;
                       switch (response.roles[1]) {
                           case 'admin' :
                               if (this.rgxpAdmin.test(this.redirectUrl)) {
                                   this.router.navigate([this.redirectUrl]);
                                   this.redirectUrl = '';
                               } else {
                                   this.router.navigate(['/admin']);
                               }
                               break;

                           case 'student' :
                               if (this.rgxpStudent.test(this.redirectUrl)) {
                                   this.router.navigate([this.redirectUrl]);
                                   this.redirectUrl = '';
                               } else {
                                   this.router.navigate(['/student']);
                               }
                               break;
                       }

                   }
                   );
    }

    logout(): void {
        this.http.get(this.authLogoutUrl)
            .subscribe(undefined, undefined, () => {
                this.router.navigate(['/login']);
            });
    }
}
