import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StudentGet, IUser } from './students-interface';
import { StudentAdd } from './students-interface';
import { GroupNameByID } from './students-interface';
import { Groups } from './students-interface';
import { Faculties } from './students-interface';
import { IResponse } from './students-interface';

@Injectable()
export class StudentsService {
  //Посилання на бек-енд
  private getStudentsURL: string = 'http://vps9615.hyperhost.name:443/api/Student/getRecordsRange/20/0';
  private addStudentURL: string = 'http://vps9615.hyperhost.name:443/api/Student/insertData';
  private getFacultiesURL: string = 'http://vps9615.hyperhost.name:443/api/Faculty/getRecords';
  private getEntityValueURL: string = 'http://vps9615.hyperhost.name:443/api/EntityManager/getEntityValues';
  
  constructor(private http: HttpClient) { }

  //Отримування масиву студентів з бек-енду
  getStudents(): Observable<StudentGet[]> {
    return this.http.get<StudentGet[]>(this.getStudentsURL);
  }
  //Отримати дані конкретного студента
  getPickedStudent(user_id: string): Observable<StudentGet[]> {
    return this.http.get<StudentGet[]>(`http://vps9615.hyperhost.name:443/api/Student/getRecords/${user_id}`);
  }
  //Інфо про юзера
  getUserInfo(id: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`http://vps9615.hyperhost.name:443/api/AdminUser/getRecords/${id}`);
  }
  //Отримання масиву об'єктів груп по заданих айдішках(айдішки прописуються в "body")
  getEntityValue(body): Observable<GroupNameByID[]&Faculties[]> {
    return this.http.post<GroupNameByID[]&Faculties[]>(this.getEntityValueURL, body);
  }
  //Додавання студента
  addStudent(body): Observable<StudentAdd|IResponse> {
    return this.http.post<StudentAdd|IResponse>(this.addStudentURL, body);
  } 
  //Отримання всіх груп вибраного факультету
  getAvailableGroups(value): Observable<Groups[]> {
    return this.http.get<Groups[]>(`http://vps9615.hyperhost.name:443/api/group/getGroupsByFaculty/${value}`);
  }
  //Отримання всіх факультетів
  getAvailableFaculties(): Observable<Faculties[]> {
    return this.http.get<Faculties[]>(this.getFacultiesURL);
  }
  //Видалення студента
  deleteStudent(id: string): Observable<IResponse> {
    return this.http.delete<IResponse>(`http://vps9615.hyperhost.name:443/api/Student/del/${id}`);
  }
  //Редагування студента
  editStudent(id, body) {
    return this.http.post(`http://vps9615.hyperhost.name:443/api/Student/update/${id}`, body);
  }
}
