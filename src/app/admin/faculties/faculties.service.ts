import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Faculties, IResponse } from './facultiesInterface';


@Injectable()
export class FacultiesService {

private urlGetFaculties = 'http://vps9615.hyperhost.name:443/api/Faculty/getRecords';
private urlDelFaculties = 'http://vps9615.hyperhost.name:443/api/Faculty/del';
private urlAddFaculties = 'http://vps9615.hyperhost.name:443/api/Faculty/insertData';
 private urlEditFaculties = 'http://vps9615.hyperhost.name:443/api/Faculty/update';

  constructor(private http: HttpClient) { }

  getFaculties() {
    return this.http.get(this.urlGetFaculties);
  }

  delFaculties(id: number) {
    return this.http.get(this.urlDelFaculties + '/' + id);
  }

  getFacultyById(id: number) {
    return this.http.get(this.urlGetFaculties + '/' + id);
  }

  addFaculty(title: string, description: string) {
    const body = {faculty_name: title, faculty_description: description};
    return this.http.post(this.urlAddFaculties, body);
  }

  editFaculty(id: number, title: string, description: string){
    const body = {faculty_name: title, faculty_description: description};
    return this.http.post(this.urlEditFaculties + '/' + id, body);
  }



  

}
