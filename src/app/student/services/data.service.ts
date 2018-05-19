import {Injectable} from '@angular/core';

@Injectable()
export class DataService {
  mark;
  answers;
  count;
  constructor() { }

  getMark(): number {
    return this.mark;
  }

  setMark(m: number) {
    this.mark = m;
  }

  getAnswers(): number {
    return this.answers;
  }

  setAnswers(a: number) {
    this.answers = a;
  }

  setCountOfQuestions(c: number) {
    this.count = c;
  }

  getCountOfQuestions(): number {
    return this.count;
  }
}

