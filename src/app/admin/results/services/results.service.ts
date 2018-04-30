import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';

@Injectable()
export class ResultsService {

  constructor(
    private http: HttpClient
  ) { }

  getTests() {
    const url = 'test/getRecords';
    return this.http.get(url);
  }

  getGroups() {
    const url = 'group/getRecords';
    return this.http.get(url);
  }

  getTestRecordsByParams(testId: number, groupId: number) {
    let url = `Result/getRecordsByTestGroupDate/${testId}`;
    if (groupId) {
      url += `/${groupId}`;
    }
    return this.http.get(url);
  }
}
