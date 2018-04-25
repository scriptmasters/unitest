import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
@Injectable()
export class SpecialityService {
  specialitiesObject: any;
  speciality: any;
  oldspeciality: any;
  constructor(private http: HttpClient) { }

  login(jsonForm: String): Observable<any> {
    return this.http.post('login/index', jsonForm, { withCredentials: true });
  }

  getSubject(): Observable<any> {
    return this.http.get('Subject/getRecords', { withCredentials: true });
  }

  getSpecialities(): Observable<any> {
    return this.http.get('Speciality/getRecords', { withCredentials: true });
  }

  addSpecialities(popupForm: String): Observable<any> {
    return this.http.post('Speciality/insertData', popupForm, { withCredentials: true });
  }
  editSpecialities(id, popupForm) {
    return this.http.post('Speciality/update/' + id, popupForm, { withCredentials: true });
  }

}
