import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import { from } from 'rxjs/observable/from';
import { filter } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { IQuestion } from '../test-player/interfaces/Question';
import { IAnswer } from '../test-player/interfaces/Answer';
import { ITestResult } from '../test-player/interfaces/TestResult';

@Injectable()
export class TestPlayerService {
  private urlStartTest = 'Log/startTest';
  private urlGetRandomQuestions = 'Question/getQuestionIdsByLevelRand';
  private urlGetTestDetails = 'testDetail/getTestDetailsByTest';
  private urlGetQuestionInfo = 'EntityManager/getEntityValues';
  private urlGetAnswer = 'SAnswer/getAnswersByQuestion';
  private urlCheckResult = 'SAnswer/checkAnswers';
  // private urlGetTimeTablesForGroup = 'getTimeTablesForGroup/';
  private testId;

  constructor(private http: HttpClient) {}

  startTest(userId, testId): Observable<any> {
    return this.http.get(this.urlStartTest + '/' + userId + '/' + testId);
  }

  getRandomQuestionsByTestDetails() {
    return this.getTestDetails(this.testId).pipe(
      map((testDetails: any) =>
        testDetails.map((test: any) => this.getRandomQuestions(test))
      ),
      switchMap(data => forkJoin(data))
    );
  }

  getRandomQuestions(test) {
    return this.http.get(
      this.urlGetRandomQuestions +
        '/' +
        test.test_id +
        '/' +
        test.level +
        '/' +
        test.tasks
    );
  }

  getTestDetails(id: number) {
    return this.http.get(this.urlGetTestDetails + '/' + id);
  }

  getQuestionsWithAnswers(testId) {
    this.testId = testId;
    return this.getQuestions().pipe(
      map((questions: any) =>
        questions.map((question: any) => this.mergeQuestionsAnswers(question))
      ),
      switchMap(data => forkJoin(data))
    );
  }

  mergeQuestionsAnswers(question) {
    return this.getAnswer(question.question_id, +question.type).map(answers => (
      {
      ...question,
      answers: this.mixAnswers(answers)
    }));
  }

  mixAnswers(answers) {
    function compareRandom(a, b) {
      return Math.random() - 0.5;
    }
    return answers.sort(compareRandom);
  }

  getQuestions() {
    return this.getRandomQuestionsByTestDetails().pipe(
      map((data: any) =>
        data.map((questions: any) =>
          questions.map(question => question.question_id)
        )
      ),
      map((questionIds: any) => this.concatArrays(questionIds)),
      switchMap(questionIds => this.getQuestionsInfo(questionIds))
    );
  }

  concatArrays(questionIds) {
    let ids = [];
    for (let i = 0; i < questionIds.length; i++) {
      ids = ids.concat(questionIds[i]);
    }
    return ids;
  }

  getQuestionsInfo(ids): Observable<IQuestion> {
    const body = { entity: 'Question', ids };
    return this.http.post<IQuestion>(this.urlGetQuestionInfo, body);
  }

  getAnswer(id, type) {
    if (type === 3 || type === 4) {
      return Observable.of([]);
    }
    return this.http.get(this.urlGetAnswer + '/' + id);
  }

  formatResults(data) {
    data = Object.values(data);

    const formatData = data.map(result => ({
      question_id: result.question_id,
      answer_ids: [result.answer_id],
    }));

    return formatData;
  }

  checkResult(data): Observable<ITestResult> {
    const result = this.formatResults(data);
    return this.http.post<ITestResult>(this.urlCheckResult, result);
  }
}
