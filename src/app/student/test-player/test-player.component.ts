import { Component, OnInit } from '@angular/core';

import { TestPlayerService } from '../services/test-player.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.scss'],
})
export class TestPlayerComponent implements OnInit {
  questions = [];
  userAnswers = {};
  selectedAnswers = {}; // for checkbox question

  constructor(
    public authService: AuthService,
    private testPlayerService: TestPlayerService
  ) {}

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

  selectedAnswer(question_id: number, answer) {
    this.userAnswers[answer.answer_id] = answer;

    if (this.selectedAnswers[answer.answer_id] === false) {
      delete this.userAnswers[answer.answer_id];
    } else {
      this.userAnswers[answer.answer_id].answer_id = [answer.answer_id];
    }
  }

  finishTest() {
    // console.log(this.userAnswers);
    console.log('Finish Test');
    this.testPlayerService.checkResult(this.userAnswers);
    // this.testPlayerService.checkResult(this.userAnswers)
    //   .subscribe((response: any) => {
    //     console.log(response);
    //   });
  }

  // ***** TIMER *****
  a = 'TIMER';
}
