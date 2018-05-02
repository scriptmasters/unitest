import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TestService {

  getTest_URL = 'Test/getRecords';
  delTest_URL = 'Test/del/';
  editTest_URL = 'Test/update/';
  addTest_URL = 'Test/insertData';
  getTestById_URL = 'test/getTestsBySubject/';
  urlGetSubjects = 'Subject/getRecords';

  constructor(private http: HttpClient) { }
  getTests() {
    return this.http.get(this.getTest_URL);
  }
  deleteTest(id: number) {
    return this.http.delete(this.delTest_URL + id);
  }
  editTest(id: number, body: object) {
   return this.http.post(this.editTest_URL + id, body);
  }
 addTest(body: object) {
   return this.http.post(this.addTest_URL, body);
 }
 getTestsById(id: number) {
   return this.http.get(this.getTestById_URL + id);
 }

 getSubjects() {
  return this.http.get(this.urlGetSubjects);
}

}
