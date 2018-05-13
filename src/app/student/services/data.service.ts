import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class DataService {
  mark;
  answers;
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
}
