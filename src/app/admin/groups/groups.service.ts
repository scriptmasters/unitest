import {AddGroup, DelGroup, Faculties, Groups, Specialities} from './interface';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
@Injectable()

export class GroupsService {

  readonly header = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json;charset=utf-8'
    })
  };
  constructor(private http: HttpClient) {}

  _getGroup(): Observable<Groups[]> {
    return this.http.get<Groups[]>('group/getRecords/', this.header);
  }

  _delGroup(id): Observable<DelGroup> {
    return this.http.get<DelGroup>('group/del/' + id, this.header);
  }

  _getFaculty(id): Observable<Faculties> {
    return this.http.get<Faculties>('Faculty/getRecords/' + id, this.header);
  }

  _getSpeciality(id): Observable<Specialities> {
    return this.http.get<Specialities>('Speciality/getRecords/' + id, this.header);
  }

  _addGroup(body): Observable<AddGroup> {
    const data = {
      'group_name': body.group_name,
      'speciality_id': body.speciality_id,
      'faculty_id': body.faculty_id
    };
    return this.http.post<AddGroup>('group/insertData', JSON.stringify(data) , this.header);
  }

  _editGroup(body): Observable<AddGroup> {
    const id = body.group_id;
    const data = {
      'group_name': body.group_name,
      'speciality_id': body.speciality_id,
      'faculty_id': body.faculty_id
    };
    return this.http.post<AddGroup>('group/update/' + id, JSON.stringify(data) , this.header);
  }

//  Two functions below are using for getting value for Dialog window
  _getFaculties(): Observable<Faculties[]> {
    return this.http.get<Faculties[]>('Faculty/getRecords/', this.header);
  }
  _getSpecialities(): Observable<Specialities[]> {
    return this.http.get<Specialities[]>('Speciality/getRecords/', this.header);
  }

}
