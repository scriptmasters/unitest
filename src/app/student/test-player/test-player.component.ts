import { Component, OnInit } from '@angular/core';

import { TestPlayerService } from '../services/test-player.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material';
import {TestResultComponent} from './test-result/test-result.component';

@Component({
  selector: 'app-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.scss'],
})
export class TestPlayerComponent implements OnInit {
  questions = [];
  userAnswers = {};
  userCheckboxAnswers = {}; // for checkbox question

  constructor(
    private testPlayerService: TestPlayerService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getQuestionsForTest();
  }

  getQuestionsForTest(): void {
    const testId = +this.route.snapshot.paramMap.get('id');
    this.testPlayerService
      .getQuestionsWithAnswers(testId)
      .subscribe((questions: any) => {
        this.questions = questions;
      });
  }

  selectedAnswer(question, answer) {
    this.userCheckboxAnswers[question.question_id] = this.userCheckboxAnswers[question.question_id] || {};
    const topModel = this.userCheckboxAnswers[question.question_id];
    topModel[answer.answer_id] = !topModel[answer.answer_id];
    const answersArr = [];
    let answers_ids = '';
    for (const key in topModel) {
      if (topModel[key] === false) {
        delete topModel[key];
      } else {
        answersArr.push(key);
        answers_ids = answersArr.join(',');
      }
    }

    this.userAnswers[question.question_id] = this.userAnswers[question.question_id] || {};
    this.userAnswers[question.question_id].question_id = question.question_id;
    this.userAnswers[question.question_id].answer_id = answers_ids;

  }

  openModal(testResult): void {
    const matDialogRef = this.dialog.open(TestResultComponent, {
      disableClose: true,
      width: '400px',
      data: { result: testResult }
    });

    matDialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['student']);
    });
  }

  finishTest() {
    console.log('Finish Test');
    this.testPlayerService.checkResult(this.userAnswers)
      .subscribe((response: any) => {
        const testResult = response;
        this.openModal(testResult);
      });
  }
}
