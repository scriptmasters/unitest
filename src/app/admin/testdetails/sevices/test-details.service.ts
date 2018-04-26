import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TestDetailsService {

  constructor(private http: HttpClient) { }

  getTestDetails(testId) {
    const url = 'testDetail/getTestDetailsByTest/' + testId;
    return this.http.get(url);
  }

  seachTestName(testDetail) {
    const url = 'testDetail/update/' + testDetail.id;
    return this.http.post(url, testDetail);
  }

  addNewTestDetail(testDetail) {
    const url = 'testDetail/insertData';
    return this.http.post(url, testDetail);
  }

  editTestDetail(testDetail) {
    const url = 'testDetail/update/' + testDetail.id;
    return this.http.post(url, testDetail);
  }

  deleteTestDetail(id) {
    const url = 'testDetail/del/' + id;
    return this.http.delete(url);
  }

  getTestById(testId) {
    const url = 'test/getRecords/' + testId;
    return this.http.get(url);
  }

}
