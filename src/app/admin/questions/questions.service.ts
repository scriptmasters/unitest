import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class QuestionsService {

  questionsGetUrl = 'question/getRecordsRangeByTest/';
  questionsQuantUrl = 'question/countRecordsByTest/';
  questionAddUrl = 'question/insertData/';
  answerAddUrl = 'answer/insertData/';
  getAnswerByQuestionUrl = 'answer/getAnswersByQuestion/';

  constructor(private http: HttpClient) {
  }
  questionsGet(testId, index, quant) {
    return this.http.get ( `${this.questionsGetUrl}${testId}/${quant}/${( index ) * quant }` );
  }

  questionQuantGet(testId) {
    return this.http.get(`${this.questionsQuantUrl}${testId}`);
  }

  questionAdd (questionBody) {
      return this.http.post(this.questionAddUrl, questionBody);
  }

  answerAdd (answerBody) {
      return this.http.post(this.answerAddUrl, answerBody);
  }

  questionDelete (id) {
    return this.http.delete(`question/del/${id}`);
  }

  answerDelete (id) {
      return this.http.delete(`answer/del/${id}`);
  }

  getAnswersByQuestion (id) {
    return this.http.get(`${this.getAnswerByQuestionUrl}${id}`);
  }
}
