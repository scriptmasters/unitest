import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';
import { TestPlayerService } from '../services/test-player.service';
import { Subject } from '../../admin/subjects/subject';
import { forEach } from '@angular/router/src/utils/collection';
import { QuestionInterface, AnswerInterface, ResultInterface } from './question-interface'

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


  constructor(
    private testPlayerService: TestPlayerService
  ) { }

  ngOnInit() {
    this.startTest();
    this.getRandomQuestion();
    // this.getAnswersByQuestion();
  }

  startTest(): void {
    this.testPlayerService.startTest()
      .subscribe((response: any) => {
        // console.log(response);
        // this.specialitys = response;
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

      let questionObject = <QuestionInterface>{};
      questionObject.answers = <AnswerInterface[]>[];

      this.testPlayerService.getRecords(item.question_id)
        .subscribe((response: any) => {
          questionObject.questionId = item.question_id;
          questionObject.text = response.pop().question_text;

          this.testPlayerService.getAnswersByQuestion(item.question_id)
            .subscribe((response: any) => {
              response.forEach(answerResponse => {
                let answer = <AnswerInterface>{};
                answer.text = answerResponse.answer_text;
                answer.answerId = answerResponse.answer_id;

                questionObject.answers.push(answer);
              });
              questionObject.ready = true;
            });
        })
      this.question_text.push(questionObject);
    })


    console.log(this.question_text);
  }
  tests(id:number, ids:Array<number>) {
    let answer:Array<any>=[];
    let arr:Array<Number>=[];
    arr.push(+ids);
    // console.log(arr);
    let result = <ResultInterface>{};
    result.answer_ids = arr;
    result.question_id = (+id);
    // console.log(result);
    answer.push(result);
    console.log(answer);
    this.testPlayerService.checkAnswers(answer).subscribe((response :any)=> {
      console.log(response);
    })
  }
}
