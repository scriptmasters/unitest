import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Speciality} from '../specialities/specialityInterface';


@Injectable()
export class StatisticService {
  private urlGetGroupsByFaculty = 'group/getGroupsByFaculty';
  private urlGetGroupsBySpeciality = 'group/getGroupsBySpeciality';
  private urlGetSpeciality = 'Speciality/getRecords';


  constructor(private http: HttpClient) { }
  getGroupsByFaculty(id: number): Observable<any> {
    return this.http.get(this.urlGetGroupsByFaculty + '/' + id);
  }
  getGroupsBySpeciality(id: number): Observable<any> {
    return this.http.get(this.urlGetGroupsBySpeciality + '/' + id);
  }
  getSpecialities(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>(this.urlGetSpeciality);
  }

  countSubject(): Observable<any> {
    return this.http.get('Subject/countRecords', { withCredentials: true });
  }
  countStudent(): Observable<any> {
    return this.http.get( 'Student/countRecords', { withCredentials: true });
  }
  countAdmin(): Observable<any> {
    return this.http.get( 'AdminUser/countRecords', { withCredentials: true });
  }
  countTest(): Observable<any> {
    return this.http.get( 'Test/countRecords', { withCredentials: true });
  }
  countQuestion(): Observable<any> {
    return this.http.get( 'Question/countRecords', { withCredentials: true });
  }
  countGroup(): Observable<any> {
    return this.http.get( 'Group/countRecords', { withCredentials: true });
  }
}
