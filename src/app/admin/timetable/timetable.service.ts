import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

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

export interface TableItem {
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

  constructor(public http: HttpClient) {}

  getSubjects(): Observable<Object> {
    return this.http.get(
      'Subject/getRecords'
    );
  }

  getGroups(): Observable<Object> {
    return this.http.get(
      'Group/getRecords'
    );
  }

  getTable(): Observable<Object> {
    return this.http.get(
      'TimeTable/getRecords'
    );
  }

  getTableBySubjectId(id: string): Observable<Object> {
    return this.http.get(
      `TimeTable/getTimeTablesForSubject/${id}`
    );
  }

  getTableByGroupId(id: string): Observable<Object> {
    return this.http.get(
      `TimeTable/getTimeTablesForGroup/${id}`
    );
  }

  addTableItem(tableItem: TableItem): Observable<Object> {
    return this.http.post(
      'TimeTable/insertData',
      tableItem
    );
  }

  updateTableItem(
    timetable_id: string,
    tableItem: TableItem
  ): Observable<Object> {
    return this.http.post(
      `TimeTable/update/${timetable_id}`,
      tableItem
    );
  }

  deleteTableItem(timetable_id: string): Observable<any> {
    return this.http.delete(
      `TimeTable/del/${timetable_id}`
    );
  }
}

export default TableService;
