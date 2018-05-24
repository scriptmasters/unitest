import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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
  private urlgetTimeStamp = 'TestPlayer/getTimeStamp';
  private urlSaveData = 'TestPlayer/saveData';
  private urlgetData = 'TestPlayer/getData';
  private urlgetRecordsTest = 'Test/getRecords/';
  public infoTestId;
  public infoTestName;
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
  getTime(): Observable<any> {
    return this.http.get(this.urlgetTimeStamp);
  }
  saveInfoTest(data): Observable<any> {
    return this.http.post(this.urlSaveData, data);
  }
  getInfoTest(): Observable<any> {
    return this.http.get(this.urlgetData);
  }
  getRecordsTest(id): Observable<any> {
    return this.http.get(this.urlgetRecordsTest + id);
  }
}
