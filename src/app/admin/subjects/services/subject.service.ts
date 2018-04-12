import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {Subject} from '../subject';

@Injectable()
export class SubjectService {

  private urlGetSubjects = 'http://vps9615.hyperhost.name:443/api/Subject/getRecords';
  private urlAddSubject = 'http://vps9615.hyperhost.name:443/api/Subject/insertData';
  private urlEditSubject = 'http://vps9615.hyperhost.name:443/api/Subject/update';

  constructor(
    private http: HttpClient
  ) { }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.urlGetSubjects);
  }

  getSubjectById(id: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.urlGetSubjects + '/' + id);
  }

  addSubject(title: string, description: string): Observable<Subject[]> {
    const body = {subject_name: title, subject_description: description};
    return this.http.post<Subject[]>(this.urlAddSubject, body);
  }

  editSubject(id: number, title: string, description: string): Observable<Subject[]> {
    const body = {subject_name: title, subject_description: description};
    return this.http.post<Subject[]>(this.urlEditSubject + '/' + id, body);
  }
}
