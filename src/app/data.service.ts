import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {

  isLogged: object;
  private toLogInURL: string = 'http://vps9615.hyperhost.name:443/api/login/index';
  private toLogOutURL: string = 'http://vps9615.hyperhost.name:443/api/login/logout';
  private isLoggedInURL: string = 'http://vps9615.hyperhost.name:443/api/login/isLogged';

  constructor(private http: HttpClient) { }


  getLogged(body): Observable<Object> {
    return this.http.post<Object>(this.toLogInURL, body);
  }

  toKnowIsLogged(): Observable<Object> {
    return this.http.get<Object>(this.isLoggedInURL);
  }

  logOut(): Observable<Object> {
    return this.http.post<Object>(this.toLogOutURL, null);
  }
}
