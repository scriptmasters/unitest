import { Component, OnInit } from '@angular/core';

import { TestPlayerService } from '../services/test-player.service';

@Component({
  selector: 'app-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.scss'],
})
export class TestPlayerComponent implements OnInit {
  questions = [];
  userAnswers = {};
  checkedAnswers = {}; // for checkbox question
  constructor(private testPlayerService: TestPlayerService) {}

  ngOnInit() {
    this.getQuestionsForTest();
  }

  getQuestionsForTest(): void {
    this.testPlayerService
      .getQuestionsWithAnswers()
      .subscribe((questions: any) => {
        this.questions = questions;
      });
  }

  chooseAnswer(question_id: number, answer) {
    this.userAnswers[answer.answer_id] = answer;

    if (this.checkedAnswers[answer.answer_id] === false) {
      delete this.userAnswers[answer.answer_id];
    } else {
      this.userAnswers[answer.answer_id].answer_id = [answer.answer_id];
    }
  }

  finishTest() {
    console.log(this.userAnswers);
    console.log('Finish Test');
    this.testPlayerService.checkResult(this.userAnswers)
      .subscribe((response: any) => {
        console.log(response);
      });
  }
}
