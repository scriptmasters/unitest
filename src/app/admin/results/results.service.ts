import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';

@Injectable()
export class ResultsService {

  constructor(
    private http: HttpClient
  ) { }

  getSubjectById(subjectId) {
    const url = 'subject/getRecords/' + subjectId;
    return this.http.get(url);
  }

  getTestById(testId) {
    const url = 'test/getRecords/' + testId;
    return this.http.get(url);
  }

}
