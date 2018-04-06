import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class TestService {

  constructor(private http: HttpClient) { }

  getTest() {
    const url = 'http://vps9615.hyperhost.name:443/api/test/getRecords';
    return this.http.get(url)
      .map((response) => response);
  }

  getSubjects() {
    const url = 'http://vps9615.hyperhost.name:443/api/subject/getRecords';
    return this.http.get(url)
      .map((response) => response);
  }

  addNewTest(newTest) {
    const url = 'http://vps9615.hyperhost.name:443/api/test/insertData';
    return this.http.post(url, newTest)
      .map((response) => response);
  }
}
