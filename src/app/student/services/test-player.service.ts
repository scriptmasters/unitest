import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TestPlayerService {

  private urlStartTest = 'Log/startTest';
  private urlRandomQuestion = 'Question/getQuestionIdsByLevelRand';
  private urlAnswersByQuestion = 'SAnswer/getAnswersByQuestion/';
  private urlgetRecords = 'Question/getRecords/';
  private urlcheckAnswers = 'SAnswer/checkAnswers/30';

  constructor(
    private http: HttpClient
  ) { }

  startTest(): Observable<any> {
    return this.http.get(this.urlStartTest + '/93/1');
  }
  getRandomQuestion(): Observable<any> {
    return this.http.get(this.urlRandomQuestion + '/1/1/4');
  }
  getAnswersByQuestion(id): Observable<any> {
    return this.http.get(this.urlAnswersByQuestion + id);
  }
  getRecords(id): Observable<any> {
    return this.http.get(this.urlgetRecords + id);
  }
  checkAnswers(body): Observable<any> {
    return this.http.post(this.urlcheckAnswers, body);
  }

}
