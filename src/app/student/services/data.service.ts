import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  constructor() {}

  getMark(): number {
    return +sessionStorage.getItem('mark');
  }

  setMark(m: number) {
    sessionStorage.setItem('mark', m.toString());
  }

  getAnswers(): number {
    return +sessionStorage.getItem('trueAnswers');
  }

  setAnswers(a: number) {
    sessionStorage.setItem('trueAnswers', a.toString());
  }

  setCountOfQuestions(n: number) {
    sessionStorage.setItem('numberOfQuestions', n.toString());
  }

  getCountOfQuestions(): number {
    return +sessionStorage.getItem('numberOfQuestions');
  }
}
