import { Groups, Faculties, Specialities, DelGroup, AddGroup } from './interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class GroupsService {
  readonly ROOT_URL_POST:string = "http://vps9615.hyperhost.name:443/api/login/index";
  readonly ROOT_URL_POST_GROUPS:string = "http://vps9615.hyperhost.name:443/api/";

  constructor(private http : HttpClient) {}
              
 
  readonly header = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json;charset=utf-8'
    })
  };

  _getGroup():Observable<Groups[]>{
    return this.http.get<Groups[]>(this.ROOT_URL_POST_GROUPS + "group/getRecords/", this.header);
  }

  _getFacultysByEntityManager(body):Observable<Faculties[]>{
    return this.http.post<Faculties[]>(this.ROOT_URL_POST_GROUPS + "EntityManager/getEntityValues/", JSON.stringify(body) ,this.header);
  }
  _getSpecialitiesByEntityManager(body):Observable<Specialities>{
    return this.http.post<Specialities>(this.ROOT_URL_POST_GROUPS + "EntityManager/getEntityValues/", JSON.stringify(body) ,this.header);
  }

  _delGroup(id):Observable<DelGroup>{
    return this.http.get<DelGroup>(this.ROOT_URL_POST_GROUPS + "group/del/" + id, this.header);
  }

  _getFaculty(id):Observable<Faculties>{
    return this.http.get<Faculties>(this.ROOT_URL_POST_GROUPS + "Faculty/getRecords/" + id, this.header);
  }

  _getSpeciality(id):Observable<Specialities>{
    return this.http.get<Specialities>(this.ROOT_URL_POST_GROUPS + "Speciality/getRecords/" + id, this.header);
  }
  
  _addGroup(body):Observable<AddGroup>{
    let data = {
      "group_name": body.group_name,
      "speciality_id": body.speciality_id,
      "faculty_id": body.faculty_id
    };
    return this.http.post<AddGroup>(this.ROOT_URL_POST_GROUPS + "group/insertData",JSON.stringify(data) ,this.header);
  }
  
  _editGroup(body):Observable<AddGroup>{
    let id = body.group_id;
    let data = {
      "group_name": body.group_name,
      "speciality_id": body.speciality_id,
      "faculty_id": body.faculty_id
    };
    return this.http.post<AddGroup>(this.ROOT_URL_POST_GROUPS + "group/update/" + id, JSON.stringify(data) ,this.header);
  }
  
//  Two fucntions below are using for getting value for Dialog window
  _getFaculties():Observable<Faculties[]>{
    return this.http.get<Faculties[]>(this.ROOT_URL_POST_GROUPS + "Faculty/getRecords/", this.header);
  }
  _getSpecialities():Observable<Specialities[]>{
    return this.http.get<Specialities[]>(this.ROOT_URL_POST_GROUPS + "Speciality/getRecords/", this.header);
  }

}
