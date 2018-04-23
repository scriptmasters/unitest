import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { QuestionsService } from '../questions.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
  providers: [ QuestionsService ]
})

export class AddQuestionComponent implements OnInit {
  constructor (private route: ActivatedRoute) {}
  test_id: string;
  answerType = 'radio';
  answerNumber = ['1'];
  questionForm = new FormGroup ({
      question_text: new FormControl(),
      level: new FormControl(),
      type: new FormControl('1'),
      '1': new FormControl()
  });

  ngOnInit () {
    this.route.queryParams
        .subscribe( params => this.test_id = params.testId);
  }

    addAnswer() {
        this.questionForm.addControl((Number(this.answerNumber[this.answerNumber.length - 1]) + 1).toString(), new FormControl('', []));
        this.answerNumber.push((Number(this.answerNumber[this.answerNumber.length - 1]) + 1).toString());
        console.log(this.answerNumber);
    }

  onQuestionTypeSelect(event) {
    event.target.value === '2' ? this.answerType = 'checkbox' : this.answerType = 'radio';

  }

}
