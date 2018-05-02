import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';
import { TestPlayerService } from '../services/test-player.service';
import { Subject } from '../../admin/subjects/subject';
import { forEach } from '@angular/router/src/utils/collection';
import { QuestionInterface, AnswerInterface, ResultInterface } from './question-interface';

@Component({
  selector: 'app-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.scss']
})
export class TestPlayerComponent implements OnInit {
  specialitys;
  question;
  answer;
  id_question;
  question_text = [];
  private test = [];
  form: FormGroup;
  id;
  ids;
  testarr = [];
  userAnswer: {};

  constructor(
    private testPlayerService: TestPlayerService
  ) { }

  ngOnInit() {
    this.startTest();
    this.getRandomQuestion();
  }

  startTest(): void {
    this.testPlayerService.startTest()
      .subscribe((response: any) => {
      });
  }

  getRandomQuestion(): void {
    this.testPlayerService.getRandomQuestion()
      .subscribe((response: any) => {
        this.question = response;
        console.log(this.question);
      });
  }
  getAnswersByQuestion() {

    this.question_text.length = 0;

    this.question.forEach((item) => {

      const questionObject = <QuestionInterface>{};
      questionObject.answers = <AnswerInterface[]>[];

      this.testPlayerService.getRecords(item.question_id)
        .subscribe((response: any) => {
          questionObject.questionId = item.question_id;
          questionObject.text = response.pop().question_text;

          this.testPlayerService.getAnswersByQuestion(item.question_id)
            .subscribe((responses: any) => {
              responses.forEach(answerResponse => {
                const answer = <AnswerInterface>{};
                answer.text = answerResponse.answer_text;
                answer.answerId = answerResponse.answer_id;

                questionObject.answers.push(answer);
              });
              questionObject.ready = true;
            });
        });
      this.question_text.push(questionObject);
    });


    console.log(this.question_text);
  }
  tests() {
    console.log(this.userAnswer);
  }
}
