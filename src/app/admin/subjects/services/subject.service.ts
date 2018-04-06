import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SubjectService {

  private urlGetSubjects = 'http://vps9615.hyperhost.name:443/api/Subject/getRecords';
  private urlAddSubject = 'http://vps9615.hyperhost.name:443/api/Subject/insertData';
  private urlEditSubject = 'http://vps9615.hyperhost.name:443/api/Subject/update';

  constructor(
    private http: HttpClient
  ) { }

  getSubjects() {
    return this.http.get(this.urlGetSubjects);
  }

  getSubjectById(id: number) {
    return this.http.get(this.urlGetSubjects + '/' + id);
  }

  addSubject(title: string, description: string) {
    const body = {subject_name: title, subject_description: description};
    return this.http.post(this.urlAddSubject, body);
  }

  editSubject(id: number, title: string, description: string) {
    const body = {subject_name: title, subject_description: description};
    return this.http.post(this.urlEditSubject + '/' + id, body);
  }
}
