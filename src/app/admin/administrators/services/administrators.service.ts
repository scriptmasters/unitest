import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrators, IResponse } from '../administratorsInterface';
import {Observable} from 'rxjs/Observable';
// import {Subject} from '../subjects/subject';

@Injectable()
export class AdministratorsService {
	private urlGetAdministrators = 'AdminUser/getRecords';
	private urlDelAdministrators = 'AdminUser/del';
	private urlAddAdministrators = 'AdminUser/insertData';
  private urlEditAdministrators = 'AdminUser/update';
  private urlGetSearchedAdministrators = 'AdminUser/getRecordsBySearch';

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

  getAdministratorById(id: number): Observable<Administrators[]>  {
    return this.http.get<Administrators[]>(this.urlGetAdministrators + '/' + id);
  }

  updateAdministrator(id: number, login: string, email: string, password: any, confirm_password: any): Observable<Administrators[]> {
    const body = {username: login, email: email, password: password, password_confirm: confirm_password};
    return this.http.post<Administrators[]>(this.urlEditAdministrators + '/' + id, body);
  }

  checkUsername(value: string): Observable<any> {
    return this.http.get<any>(`AdminUser/checkUserName/${value}`).map(res => !res.response);
  }
 
  checkEmailAddress(value: string): Observable<any> {
    return this.http.get<any>(`AdminUser/checkEmailAddress/${value}`).map(res => !res.response);
  }
    getSearchedAdministrators(searchString) {
        return this.http.get(this.urlGetSearchedAdministrators + '/' + searchString);
    }
}

