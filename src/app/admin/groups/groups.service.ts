import { Groups, Faculties, Specialities, DelGroup } from './interface';
import { Injectable, group } from '@angular/core';
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
    return this.http.get<Groups[]>(this.ROOT_URL_POST_GROUPS + "group/getRecordsRange/20/0/", this.header);
  }

  _getFacultysByEntityManager(body):Observable<Faculties[]>{
    return this.http.post<Faculties[]>(this.ROOT_URL_POST_GROUPS + "EntityManager/getEntityValues/", JSON.stringify(body) ,this.header);
  }
  _getSpecialitiesByEntityManager(body):Observable<Specialities>{
    return this.http.post<Specialities>(this.ROOT_URL_POST_GROUPS + "EntityManager/getEntityValues/", JSON.stringify(body) ,this.header);
  }

  _delGroup(id):Observable<DelGroup>{
    return this.http.get<DelGroup>(this.ROOT_URL_POST_GROUPS + "Group/del/" + id, this.header);
  }
  
//  Two fucntions below are using for getting value for Dialog window
  _getFaculties():Observable<Faculties[]>{
    return this.http.get<Faculties[]>(this.ROOT_URL_POST_GROUPS + "Faculty/getRecords/", this.header);
  }
  _getSpecialities():Observable<Specialities[]>{
    return this.http.get<Specialities[]>(this.ROOT_URL_POST_GROUPS + "Speciality/getRecords/", this.header);
  }

}
