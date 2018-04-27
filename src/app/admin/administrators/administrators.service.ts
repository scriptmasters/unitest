import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrators, IResponse } from './administratorsInterface';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AdministratorsService {
	private urlGetAdministrators = 'AdminUser/getRecords';
	private urlDelAdministrators = 'AdminUser/del';

  constructor(private http: HttpClient) { }
  
  getAdministrators(): Observable<Administrators[]> {
    return this.http.get<Administrators[]>(this.urlGetAdministrators);
  }

  delAdministrator(id: number): Observable<IResponse>  {
    return this.http.get<IResponse>(this.urlDelAdministrators + '/' + id);
  }
}

