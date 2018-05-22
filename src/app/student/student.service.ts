import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class StudentService {
  private urlgetRecords = 'Student/getRecords/';
  private urlgetRecordsGroup = 'Group/getRecords/';
  private urlgetRecordsSubject = 'subject/getRecords/';
  private urlgetRecordsSpeciality = 'Speciality/getRecords/';
  private urlgetRecordsFaculty = 'Faculty/getRecords/';
  private urlgetTimeTablesForGroup = 'timeTable/getTimeTablesForGroup/';
  private urlgetTestsBySubject = 'test/getTestsBySubject/';
  private urlgetTestDetailsByTest = 'testDetail/getTestDetailsByTest/';
  constructor(private http: HttpClient) {}

  getRecords(id): Observable<any> {
    return this.http.get(this.urlgetRecords + id);
  }
  getRecordsGroup(id): Observable<any> {
    return this.http.get(this.urlgetRecordsGroup + id);
  }
  getRecordsSpeciality(id): Observable<any> {
    return this.http.get(this.urlgetRecordsSpeciality + id);
  }
  getRecordsFaculty(id): Observable<any> {
    return this.http.get(this.urlgetRecordsFaculty + id);
  }
  getTimeTablesForGroup(id): Observable<any> {
    return this.http.get(this.urlgetTimeTablesForGroup + id);
  }
  getRecordsSubject(id): Observable<any> {
    return this.http.get(this.urlgetRecordsSubject + id);
  }
  getTestsBySubject(id): Observable<any> {
    return this.http.get(this.urlgetTestsBySubject + id);
  }
  getTestDetailsByTest(id): Observable<any> {
    return this.http.get(this.urlgetTestDetailsByTest + id);
  }
}
