import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StudentGet } from './students-interface';
import { StudentAdd } from './students-interface';
import { GroupNameByID } from './students-interface';
import { Groups } from './students-interface';
import { Faculties } from './students-interface';
import { IResponse } from './students-interface';

@Injectable()
export class StudentsService {

  getStudentsURL: string = 'http://vps9615.hyperhost.name:443/api/Student/getRecordsRange/20/0';
  addStudentURL: string = 'http://vps9615.hyperhost.name:443/api/Student/insertData';
  getFacultiesURL: string = 'http://vps9615.hyperhost.name:443/api/Faculty/getRecords';
  getEntityValueURL: string = 'http://vps9615.hyperhost.name:443/api/EntityManager/getEntityValues';
  constructor(private http: HttpClient) { }


  getStudents(): Observable<StudentGet[]> {
    return this.http.get<StudentGet[]>(this.getStudentsURL);
  }

  getEntityValue(body): Observable<GroupNameByID[]> {
    return this.http.post<GroupNameByID[]>(this.getEntityValueURL, body);
  }

  addStudent(body): Observable<StudentAdd|IResponse> {
    return this.http.post<StudentAdd|IResponse>(this.addStudentURL, body);
  } 

  getAvailableGroups(value): Observable<Groups[]> {
    return this.http.get<Groups[]>(`http://vps9615.hyperhost.name/api/group/getGroupsByFaculty/${value}`);
  }

  getAvailableFaculties(): Observable<Faculties[]> {
    return this.http.get<Faculties[]>(this.getFacultiesURL);
  }
}
