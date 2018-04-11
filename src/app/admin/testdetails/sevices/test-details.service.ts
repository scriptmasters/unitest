import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TestDetailsService {

  constructor(private http: HttpClient) { }

  getTestDetails(testId) {
    const url = 'http://vps9615.hyperhost.name:443/api/testDetail/getTestDetailsByTest/' + testId;
    // const param = {id: testId};
    return this.http.get(url)
      .map((response) => response);
  }

  addNewTestDetail(testDetail) {
    const url = 'http://vps9615.hyperhost.name:443/api/testDetail/insertData';
    return this.http.post(url, testDetail)
      .map((response) => response);
  }

  editTestDetail(testDetail) {
    const url = 'http://vps9615.hyperhost.name:443/api/testDetail/update/' + testDetail.id;
    return this.http.post(url, testDetail)
      .map((response) => response);
  }

  deleteTestDetail(id) {
    const url = 'http://vps9615.hyperhost.name:443/api/testDetail/del/' + id;
    return this.http.delete(url)
      .map((response) => response);
  }
}
