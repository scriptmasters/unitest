import {Injectable} from '@angular/core';
import {ITimeStamp} from '../test-player/interfaces/TimeStamp';
import {SaveTime} from '../test-player/interfaces/SaveTime';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class TimerService {

  constructor( private http: HttpClient ) { }

  private urlTimeStamp = 'TestPlayer/getTimeStamp';
  private urlSaveEndTime = 'TestPlayer/saveEndTime';
  private urlGetEndTime = 'TestPlayer/getEndTime';
  private urlClearTime = 'TestPlayer/resetSessionData';
  private urlStudentTimetable = 'timeTable/getTimeTableForGroupAndSubject/';
  private urlStudentRecords = 'Student/getRecords/';
  private urlTest = 'Test/getRecords/';

  getTest(id): Observable<any> {
    return this.http.get<any>(this.urlTest + id);
  }

  getStudentRecords(id): Observable<any> {
    return this.http.get<any>(this.urlStudentRecords + id);
  }

  getStudentTimetable(idGroup, idSubject): Observable<any> {
    return this.http.get<any>(this.urlStudentTimetable + idGroup + '/' + idSubject);
  }

  getTimeStamp(): Observable<ITimeStamp> {
    return this.http.get<ITimeStamp>(this.urlTimeStamp);
  }

  saveEndTime(data): Observable<SaveTime> {
    return this.http.post<SaveTime>(this.urlSaveEndTime, JSON.stringify(data));
  }

  getEndTime(): Observable<SaveTime> {
    return this.http.get<SaveTime>(this.urlGetEndTime);
  }

  clearTime(): Observable<any> {
    return this.http.get<any>(this.urlClearTime);
  }
}
