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
  timetable_id: string;
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
      .get("./assets/mocks/subjects.json")
      .pipe(tap(subjects => subjects), catchError(() => []));
  }

  getGroups(): Observable<Group[]> {
    return this.http
      .get("./assets/mocks/groups.json")
      .pipe(tap(groups => groups), catchError(() => []));
  }

  getTable(): Observable<TimeEntity[]> {
    return this.http
      .get("./assets/mocks/timeTable.json")
      .pipe(tap(table => table), catchError(() => []));
  }
}

export default TableService;