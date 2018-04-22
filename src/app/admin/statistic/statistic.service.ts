import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
const URL = "http://vps9615.hyperhost.name:443/api";
@Injectable()
export class StatisticService {

  constructor(private http: HttpClient) { }
  countSubject(): Observable<any> {
    return this.http.get(URL + "/Subject/countRecords", { withCredentials: true })
  }
  countStudent(): Observable<any> {
    return this.http.get(URL + "/Student/countRecords", { withCredentials: true })
  }
  countAdmin(): Observable<any> {
    return this.http.get(URL + "/AdminUser/countRecords", { withCredentials: true })
  }
  countTest(): Observable<any> {
    return this.http.get(URL + "/Test/countRecords", { withCredentials: true })
  }
  countQuestion(): Observable<any> {
    return this.http.get(URL + "/Question/countRecords", { withCredentials: true })
  }
  countGroup(): Observable<any> {
    return this.http.get(URL + "/Group/countRecords", { withCredentials: true })
  }
}
