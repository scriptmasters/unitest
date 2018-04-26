import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class TestPlayerService {

  private urlStartTest = 'Log/startTest';
  private urlRandomQuestion = 'Question/getQuestionIdsByLevelRand'

  constructor(
    private http: HttpClient
  ) { }

  startTest() {
    return this.http.get(this.urlStartTest + '/10/1');
  }

  getRandomQuestion() {
    return this.http.get(this.urlRandomQuestion + '/1/3/1');
  }

}
