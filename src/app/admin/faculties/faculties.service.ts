import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Faculties, IResponse } from './facultiesInterface';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FacultiesService {
private urlGetFaculties = 'http://vps9615.hyperhost.name:443/api/Faculty/getRecords';
private urlDelFaculties = 'http://vps9615.hyperhost.name:443/api/Faculty/del';
private urlAddFaculties = 'http://vps9615.hyperhost.name:443/api/Faculty/insertData';
 private urlEditFaculties = 'http://vps9615.hyperhost.name:443/api/Faculty/update';

  constructor(private http: HttpClient) { }

  getFaculties(): Observable<Faculties[]> {
    return this.http.get<Faculties[]>(this.urlGetFaculties);
  }

  delFaculties(id: number): Observable<IResponse>  {
    return this.http.get<IResponse>(this.urlDelFaculties + '/' + id);
  }

  getFacultyById(id: number): Observable<Faculties[]>  {
    return this.http.get<Faculties[]>(this.urlGetFaculties + '/' + id);
  }

  addFaculty(title: string, description: string): Observable<Faculties[]> {
    const body = {faculty_name: title, faculty_description: description};
    return this.http.post<Faculties[]>(this.urlAddFaculties, body);
  }

  editFaculty(id: number, title: string, description: string): Observable<Faculties[]> {
    const body = {faculty_name: title, faculty_description: description};
    return this.http.post<Faculties[]>(this.urlEditFaculties + '/' + id, body);
  }
}
