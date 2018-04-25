import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import { Speciality, IResponse } from './specialityInterface';
const URL = 'http://vps9615.hyperhost.name:443/api';
@Injectable()
export class SpecialityService {
  specialitiesObject: any;
  speciality: any;
  oldspeciality: any;
  constructor(private http: HttpClient) { }

  login(jsonForm: String): Observable<any> {
    return this.http.post(URL + '/login/index', jsonForm, { withCredentials: true });
  }

  getSpecialities(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>(URL + '/Speciality/getRecords', { withCredentials: true });
  }

  addSpecialities(code: number, name: string): Observable<Speciality[]> {
    const body = {speciality_code: code, speciality_name: name};
    return this.http.post<Speciality[]>(URL + '/Speciality/insertData', body, { withCredentials: true });
  }
  editSpecialities(id: number, code: number, name: string): Observable<Speciality[]> {
    const body = {speciality_code: code, speciality_name: name};
    return this.http.post<Speciality[]>(URL + '/Speciality/update/' + id, body, { withCredentials: true });
  }
  delSpecialitiey(id): Observable<IResponse> {
    return this.http.post<IResponse>(URL + '/Speciality/del/' + id, { withCredentials: true });
  }
  getSpecialitiesId(id): Observable<Speciality[]> {
    return this.http.get<Speciality[]>(URL + '/Speciality/getRecords/' + id, { withCredentials: true });
  }
}
