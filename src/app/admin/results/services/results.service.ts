import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ResultsService {

  constructor(
    private http: HttpClient
  ) {
  }

  getTests() {
    const url = 'test/getRecords';
    return this.http.get(url);
  }

  getTestById(testId) {
    const url = 'test/getRecords/' + testId;
    return this.http.get(url);
  }

  getGroups() {
    const url = 'group/getRecords';
    return this.http.get(url);
  }

  getStudents(ids: number[]) {
    const url = 'EntityManager/getEntityValues';
    const body = {entity: 'Student', ids};
    return this.http.post(url, body);
  }

  getTestRecordsByParams(testId: number, groupId: number) {
    let url = `Result/getRecordsByTestGroupDate/${testId}`;
    if (groupId) {
      url += `/${groupId}`;
    }
    return this.http.get(url);
  }

  getResultTestIdsByGroup(groupId) {
    const url = `Result/getResultTestIdsByGroup/${groupId}`;
    return this.http.get(url);
  }
}
