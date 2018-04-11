import { Injectable, NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError, map, tap } from "rxjs/operators";

export interface Subject {
  subject_id: string;
  subject_name: string;
  subject_description: string;
}

export interface Group {
  group_id: string;
  group_name: string;
  speciality_id: string;
  faculty_id: string;
}

export interface TimeEntity {
  timetable_id?: string;
  group_id: string;
  subject_id: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
}

@Injectable()
export class TableService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json;charset=utf8"
    })
  };

  constructor(public http: HttpClient) {}

  getSubjects(): Observable<Subject[]> {
    return this.http
      .get("http://vps9615.hyperhost.name:443/api/Subject/getRecords")
      .pipe(tap(subjects => subjects), catchError(() => []));
  }

  getGroups(): Observable<Group[]> {
    return this.http
      .get("http://vps9615.hyperhost.name:443/api/Group/getRecords")
      .pipe(tap(groups => groups), catchError(() => []));
  }

  getTable(): Observable<TimeEntity[]> {
    return this.http
      .get("http://vps9615.hyperhost.name:443/api/TimeTable/getRecords")
      .pipe(tap(table => table), catchError(() => []));
  }

  addTableItem(timeEntity: TimeEntity): Observable<TimeEntity[]> {
    return this.http
      .post(
        "http://vps9615.hyperhost.name:443/api/TimeTable/insertData",
        timeEntity
      )
      .pipe(tap(timeEntity => timeEntity), catchError(() => []));
  }

  updateTableItem(
    timetable_id: string,
    timeEntity: TimeEntity
  ): Observable<TimeEntity[]> {
    return this.http
      .post(
        `http://vps9615.hyperhost.name:443/api/TimeTable/update/${timetable_id}`,
        timeEntity
      )
      .pipe(tap(timeEntity => timeEntity), catchError(() => []));
  }

  deleteTableItem(timetable_id: string): Observable<any> {
    return this.http.delete(
      `http://vps9615.hyperhost.name:443/api/TimeTable/del/${timetable_id}`
    );
  }
}

export default TableService;
