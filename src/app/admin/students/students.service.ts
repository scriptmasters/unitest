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
  private getStudentsURL = 'Student/getRecordsRange/20/0';
  private addStudentURL = 'Student/insertData';
  private getFacultiesURL = 'Faculty/getRecords';
  private getEntityValueURL = 'EntityManager/getEntityValues';

  constructor(private http: HttpClient) { }

  //Отримування масиву студентів з бек-енду
  getStudents(): Observable<StudentGet[]> {
    return this.http.get<StudentGet[]>(this.getStudentsURL);
  }
  //Отримати дані конкретного студента
  getPickedStudent(user_id: string): Observable<StudentGet[]> {
    return this.http.get<StudentGet[]>(`Student/getRecords/${user_id}`);
  }
  //Інфо про юзера
  getUserInfo(id: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`AdminUser/getRecords/${id}`);
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
    return this.http.get<Groups[]>(`group/getGroupsByFaculty/${value}`);
  }
  //Отримання всіх факультетів
  getAvailableFaculties(): Observable<Faculties[]> {
    return this.http.get<Faculties[]>(this.getFacultiesURL);
  }
  //Видалення студента
  deleteStudent(id: string): Observable<IResponse> {
    return this.http.delete<IResponse>(`Student/del/${id}`);
  }
  //Редагування студента
  editStudent(id, body) {
    return this.http.post(`Student/update/${id}`, body);
  }
  //Отримати всіх студентів вибраної групи
  getStudentsByGroup(id: any): Observable<StudentGet[]> {
    return this.http.get<StudentGet[]>(`student/getStudentsByGroup/${id}`);
  }
}
