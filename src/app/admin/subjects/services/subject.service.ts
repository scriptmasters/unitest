import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {Subject} from '../subject';

@Injectable()
export class SubjectService {

  private urlGetSubjects = 'http://vps9615.hyperhost.name:443/api/Subject/getRecords';
  // private urlGetSubjectByName = 'http://vps9615.hyperhost.name:443/api/Subject/getRecordsBySearch';
  private urlAddSubject = 'http://vps9615.hyperhost.name:443/api/Subject/insertData';
  private urlEditSubject = 'http://vps9615.hyperhost.name:443/api/Subject/update';
  private urlDeleteSubject = 'http://vps9615.hyperhost.name:443/api/Subject/del';

  constructor(
    private http: HttpClient
  ) { }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.urlGetSubjects);
  }

  getSubjectById(id: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.urlGetSubjects + '/' + id);
  }

  // getSubjectByName(title: string): Observable<Subject[]> {
  //   return this.http.get<Subject[]>(this.urlGetSubjectByName + '/' + title);
  // }

  addSubject(title: string, description: string): Observable<Subject[]> {
    const body = {subject_name: title, subject_description: description};
    return this.http.post<Subject[]>(this.urlAddSubject, body);
  }

  editSubject(id: number, title: string, description: string): Observable<Subject[]> {
    const body = {subject_name: title, subject_description: description};
    return this.http.post<Subject[]>(this.urlEditSubject + '/' + id, body);
  }
  deleteSubject(id: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.urlDeleteSubject + '/' + id);
  }
}
