import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class QuestionsService {

  questionsGetUrl = 'question/getRecordsRangeByTest/';
  questionsQuantUrl = 'question/countRecordsByTest/';

  constructor(private http: HttpClient) {
  }
  questionsGet(testId, index, quant) {
    return this.http.get ( `${this.questionsGetUrl}${testId}/${quant}/${( index ) * quant }` );
  }

  questionQuantGet(testId) {
    return this.http.get(`${this.questionsQuantUrl}${testId}`);
  }

}
