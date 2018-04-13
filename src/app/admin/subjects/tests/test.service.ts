import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Test } from './test';

@Injectable()
export class TestService {

  getTest_URL: string = 'http://vps9615.hyperhost.name:443/api/Test/getRecords';
  delTest_URL: string = 'http://vps9615.hyperhost.name:443/api/Test/del/';
  editTest_URL: string = 'http://vps9615.hyperhost.name:443/api/Test/update/';
  addTest_URL: string = 'http://vps9615.hyperhost.name:443/api/Test/insertData';
  getTestById_URL: string = 'http://vps9615.hyperhost.name:443/api/test/getTestsBySubject/';
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
}
