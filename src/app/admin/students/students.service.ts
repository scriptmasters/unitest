import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import IStudent from './interfaces/IStudent';
import IUser from './interfaces/IUser';
import IGroup from './interfaces/IGroup';
import IFaculty from './interfaces/IFaculty';
import IResponse from './interfaces/IResponse';
import IResponseRec from './interfaces/IResponseRec';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable()
export class StudentsService {
  // CRUD endpoints
  private readonly createStudentUrl = 'Student/insertData';
  private readonly readStudentUrl = 'Student/getRecords';
  private readonly updateStudentUrl = 'Student/update';
  private readonly deleteStudentUrl = 'Student/del';

  constructor(private http: HttpClient) { }

  // Retrieve array of students from back-end
  getStudents(pageSize, index): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`Student/getRecordsRange/${pageSize}/${pageSize * index}`);
  }
  // Count students
  countStudent(): Observable<IResponseRec> {
    return this.http.get<IResponseRec>('Student/countRecords');
  }
  // get current student's data
  getPickedStudent(user_id: string): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`${this.readStudentUrl}/${user_id}`);
  }
  // Info of current student
  getUserInfo(id: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`AdminUser/getRecords/${id}`);
  }
  // To get neccessary Entity from server
  getEntityValue(body): Observable<IGroup[]&IFaculty[]> {
    return this.http.post<IGroup[]&IFaculty[]>(`EntityManager/getEntityValues`, body);
  }
  // Creating new student
  addStudent(body): Observable<IStudent|IResponse> {
    return this.http.post<IStudent|IResponse>(`${this.createStudentUrl}`, body);
  }
  // get current groups by faculty
  getAvailableGroups(value): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(`group/getGroupsByFaculty/${value}`);
  }
  // get all faculties
  getAvailableFaculties(): Observable<IFaculty[]> {
    return this.http.get<IFaculty[]>(`Faculty/getRecords`);
  }
  // Deleting a student
  deleteStudent(id: string): Observable<IResponse> {
    return this.http.delete<IResponse>(`${this.deleteStudentUrl}/${id}`);
  }
  // Updating student info
  editStudent(id, body) {
    return this.http.post(`${this.updateStudentUrl}/${id}`, body);
  }
  // get all students that are currently in picked group
  getStudentsByGroup(id: any): Observable<IStudent[] & IResponse> {
    return this.http.get<IStudent[] & IResponse>(`student/getStudentsByGroup/${id}`);
  }
  // To find out is there same username or not
  checkUsername(value: string): Observable<any> {
    return this.http.get<any>(`AdminUser/checkUserName/${value}`).map(res => !res.response);
  }
  // To find out is there same username or not
  checkEmailAddress(value: string): Observable<any> {
    return this.http.get<any>(`AdminUser/checkEmailAddress/${value}`).map(res => !res.response);
  }
  // server side filter by surname
  getStudentsBySearch(value: string): Observable<IStudent[] & IResponse> {
    return this.http.get<IStudent[] & IResponse>(`student/getRecordsBySearch/${value}`);
  }
}
