import { Injectable } from '@angular/core';

@Injectable()
export class QuestionService {
  constructor() {}

  getQuestions() {
    return JSON.parse(window.localStorage.getItem('questions'));
  }

  setQuestions(questions) {
    window.localStorage.setItem('questions', JSON.stringify(questions));
  }
}
