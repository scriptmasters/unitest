import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import { Speciality, IResponse } from './specialityInterface';
@Injectable()
export class SpecialityService {
  constructor(private http: HttpClient) { }

  login(jsonForm: String): Observable<any> {
    return this.http.post('login/index', jsonForm, { withCredentials: true });
  }

  getSpecialities(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>('Speciality/getRecords', { withCredentials: true });
  }

  addSpecialities(code: number, name: string): Observable<Speciality[]> {
    const body = {speciality_code: code, speciality_name: name};
    return this.http.post<Speciality[]>('Speciality/insertData', body, { withCredentials: true });
  }
  editSpecialities(id: number, code: number, name: string): Observable<Speciality[]> {
    const body = {speciality_code: code, speciality_name: name};
    return this.http.post<Speciality[]>('Speciality/update/' + id, body, { withCredentials: true });
  }
  delSpecialitiey(id): Observable<IResponse> {
    return this.http.post<IResponse>('Speciality/del/' + id, { withCredentials: true });
  }
  getSpecialitiesId(id): Observable<Speciality[]> {
    return this.http.get<Speciality[]>('Speciality/getRecords/' + id, { withCredentials: true });
  }
}
