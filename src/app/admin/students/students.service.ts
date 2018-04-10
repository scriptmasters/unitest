import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StudentGet } from './students-interface';
import { StudentAdd } from './students-interface';
import { GroupNameByID } from './students-interface';

@Injectable()
export class StudentsService {

  getStudentsURL: string = 'http://vps9615.hyperhost.name:443/api/Student/getRecordsRange/20/0';
  addStudentURL: string = 'http://vps9615.hyperhost.name:443/api/Student/insertData';
  getEntityValueURL: string = 'http://vps9615.hyperhost.name:443/api/EntityManager/getEntityValues';
  constructor(private http: HttpClient) { }


  getStudents(): Observable<StudentGet[]> {
    return this.http.get<StudentGet[]>(this.getStudentsURL);
  }

  getEntityValue(body): Observable<GroupNameByID[]> {
    return this.http.post<GroupNameByID[]>(this.getEntityValueURL, body);
  }

  addStudent(body): void {
    this.http.post<StudentAdd>(this.addStudentURL, body).subscribe();
  } 
}
