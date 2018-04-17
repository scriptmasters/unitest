import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
@Injectable()
export class StatisticService {

  constructor(private http: HttpClient) { }
  countSubject(): Observable<any> {
    return this.http.get('Subject/countRecords', { withCredentials: true });
  }
  countStudent(): Observable<any> {
    return this.http.get( 'Student/countRecords', { withCredentials: true });
  }
  countAdmin(): Observable<any> {
    return this.http.get( 'AdminUser/countRecords', { withCredentials: true });
  }
  countTest(): Observable<any> {
    return this.http.get( 'Test/countRecords', { withCredentials: true });
  }
  countQuestion(): Observable<any> {
    return this.http.get( 'Question/countRecords', { withCredentials: true });
  }
  countGroup(): Observable<any> {
    return this.http.get( 'Group/countRecords', { withCredentials: true });
  }
}
