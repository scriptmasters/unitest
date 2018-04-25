import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionsService} from '../questions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ResponseMessageComponent} from '../../../shared/response-message/response-message.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
  providers: [ QuestionsService ]
})

export class AddQuestionComponent implements OnInit {
  constructor (private route: ActivatedRoute,
               private questionsService: QuestionsService,
               private dialog: MatDialog,
               private router: Router
               ) {}
  test_id: string;
  answerType = 'radio';
  answerNumber = ['1'];
  correctAnswers = [];
  attachment = '';
  questionForm = new FormGroup ({
      question_text: new FormControl('', Validators.required),
      level: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^([1-9]|1[0-9]|20)$/)])),
      type: new FormControl('1', Validators.required),
      '1': new FormControl('', Validators.required)
  });

  ngOnInit () {
    this.route.queryParams
        .subscribe( params => this.test_id = params.testId);
  }

  addAnswer() {
        this.questionForm.addControl((
            Number(this.answerNumber[this.answerNumber.length - 1]) + 1).toString(),
            new FormControl('', [Validators.required]
        ));
        this.answerNumber.push((Number(this.answerNumber[this.answerNumber.length - 1]) + 1).toString());
  }

  onQuestionTypeSelect(event) {
    if (event.target.value === '2') {
        this.answerType = 'checkbox';
    } else {
        this.answerType = 'radio';
        this.correctAnswers = [Math.max(...this.correctAnswers) + ''];
    }
  }

  correctAnswer(number) {
      if (this.answerType === 'radio') {
          this.correctAnswers = [number];
      } else {
              this.correctAnswers.indexOf(number) === -1 ?
              this.correctAnswers.push(number) : this.correctAnswers.splice(this.correctAnswers.indexOf(number), 1);
      }
  }

  addAttachment(event) {
      const fileReader = new FileReader();
      const img = event.target.files[0];
      fileReader.onload = () => this.attachment = fileReader.result;
      fileReader.readAsDataURL(img);
  }

  questionSubmit() { // TODO: add correct answer statement check
      const questionBody = {
          'test_id': this.test_id,
          'question_text': this.questionForm.get('question_text').value,
          'level': this.questionForm.get('level').value,
          'type': this.questionForm.get('type').value,
          'attachment': this.attachment
      };

      this.questionsService.questionAdd(questionBody)
          .subscribe(data => {
              for (let answer = 1; answer <= this.answerNumber.length; answer++) {
                  const answerBody = {
                      'question_id': data[0].question_id,
                      true_answer: '',
                      answer_text: this.questionForm.get(`${answer}`).value,
                      attachment: ''
                  };
                  this.correctAnswers.indexOf(answer + '') !== -1 ? answerBody.true_answer = '1' : answerBody.true_answer = '0';

                  this.questionsService.answerAdd(answerBody)
                      .subscribe(undefined, error => console.log(error));
              }
              data[0].question_id ? this.openModalMessage('Завдання успішно додане') :
                  this.openModalMessage('Виникла помилка при додаванні');
                  this.router.navigate(['/admin/questions'], {
                      queryParams: {
                          testId: this.test_id,
                          page: 0
                      }
                  });
          }, error => console.log(error));
  }

    openModalMessage(msg: string, w: string = '400px'): void {
        this.dialog.open(ResponseMessageComponent, {
            width: w,
            data: {
                message: msg
            }
        });
    }
}
