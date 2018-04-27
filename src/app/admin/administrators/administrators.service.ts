import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrators, IResponse } from './administratorsInterface';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AdministratorsService {
	private urlGetAdministrators = 'AdminUser/getRecords';
	private urlDelAdministrators = 'AdminUser/del';
	private urlAddAdministrators = 'AdminUser/insertData';

  constructor(private http: HttpClient) { }
  
  getAdministrators(): Observable<Administrators[]> {
    return this.http.get<Administrators[]>(this.urlGetAdministrators);
  }

  delAdministrator(id: number): Observable<IResponse>  {
    return this.http.get<IResponse>(this.urlDelAdministrators + '/' + id);
  }

  addAdministrator(login: string, email: string, password: any, confirm_password: any): Observable<Administrators[]> {
    const body = {username: login, email: email, password: password, password_confirm: confirm_password};
    return this.http.post<Administrators[]>(this.urlAddAdministrators, body);
  }
}

