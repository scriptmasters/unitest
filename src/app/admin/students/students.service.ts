import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import IStudent from './interfaces/IStudent';
import IUser from './interfaces/IUser';
import IGroup from './interfaces/IGroup';
import IFaculty from './interfaces/IFaculty';
import IResponse from './interfaces/IResponse';

@Injectable()
export class StudentsService {
  // Посилання на бек-енд
  private readonly createStudentUrl = 'Student/insertData';
  private readonly readStudentUrl = 'Student/getRecords';
  private readonly updateStudentUrl = 'Student/update';
  private readonly deleteStudentUrl = 'Student/del';

  constructor(private http: HttpClient) { }

  // Отримування масиву студентів з бек-енду
  getStudents(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`Student/getRecordsRange/20/0`);
  }
  // Отримати дані конкретного студента
  getPickedStudent(user_id: string): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`${this.readStudentUrl}/${user_id}`);
  }
  // Інфо про юзера
  getUserInfo(id: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`AdminUser/getRecords/${id}`);
  }
  // Отримання масиву об'єктів груп по заданих айдішках(айдішки прописуються в "body")
  getEntityValue(body): Observable<IGroup[]&IFaculty[]> {
    return this.http.post<IGroup[]&IFaculty[]>(`EntityManager/getEntityValues`, body);
  }
  // Додавання студента
  addStudent(body): Observable<IStudent|IResponse> {
    return this.http.post<IStudent|IResponse>(`${this.createStudentUrl}`, body);
  }
  // Отримання всіх груп вибраного факультету
  getAvailableGroups(value): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(`group/getGroupsByFaculty/${value}`);
  }
  // Отримання всіх факультетів
  getAvailableFaculties(): Observable<IFaculty[]> {
    return this.http.get<IFaculty[]>(`Faculty/getRecords`);
  }
  // Видалення студента
  deleteStudent(id: string): Observable<IResponse> {
    return this.http.delete<IResponse>(`${this.deleteStudentUrl}/${id}`);
  }
  // Редагування студента
  editStudent(id, body) {
    return this.http.post(`${this.updateStudentUrl}/${id}`, body);
  }
  // Отримати всіх студентів вибраної групи
  getStudentsByGroup(id: any): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`student/getStudentsByGroup/${id}`);
  }
}
