import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionsService} from '../questions.service';
import {IAnswer, IAnswerSet, IQuestion} from '../questions-interface';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ResponseMessageComponent} from '../../../shared/response-message/response-message.component';
import {DeleteConfirmComponent} from '../../../shared/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
  providers: [ QuestionsService ]
})
export class AddQuestionComponent implements OnInit {


 form;
 isFirstNumberIncorrect = false;
 isSecondNumberIncorrect = false;
 correctAnswerInputType = 'radio';
 answersIdNumbersArray = [];
 newAnswersArray = [];

 selTestId: string;
 selTestName: string;

new_question: IQuestion = {
    test_id: this.selTestId,
    question_id: '',
    question_text: '',
    level: '1',
    type: '1',
    attachment: ''
};

new_answer: IAnswerSet = {
  question_id: '',
  true_answer: '0',
  answer_text: '',
  attachment: '',
};

constructor(
  private questionService: QuestionsService,
  private dialog: MatDialog,
  private matDialogRef: MatDialogRef<AddQuestionComponent>,
  public snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.selTestId = this.data.sel_TestId;
    this.selTestName = this.data.sel_TestName;

    this.form = new FormGroup({
    });
  }


  addAnswer() {
    if (this.correctAnswerInputType === 'num' ) {

        const NUMBER_PATTERN = /[-+]?[0-9]*\.[0-9]+$|^[-+]?[0-9]+\.$|^[-+]?[0-9]*$/;
            this.form = new FormGroup({
            '0': new FormControl('', [Validators.required, Validators.pattern(NUMBER_PATTERN)]),
            '1': new FormControl('', [Validators.required, Validators.pattern(NUMBER_PATTERN)])
            });

         this.answersIdNumbersArray = [1, 2];
         this.newAnswersArray = [{}, {}];

         this.newAnswersArray.forEach(element => {  element.true_answer = '1'; element.attachment = ''; });

    } else {

      this.form.addControl( (this.newAnswersArray.length + 1).toString(), new FormControl('', [Validators.required]) );
                  const lastIndex = this.answersIdNumbersArray.length - 1;
                  this.answersIdNumbersArray.push(
                    lastIndex === -1 ? 1 : this.answersIdNumbersArray[lastIndex] + 1
                  );
                  this.newAnswersArray.push({answer_text: '', attachment: ''});

                  if (this.correctAnswerInputType === 'txt' ) {
                    this.newAnswersArray[this.newAnswersArray.length - 1].true_answer = '1';
                  } else {
                    this.newAnswersArray[this.newAnswersArray.length - 1].true_answer = '0';
                  }
    }
  }


  onAnswerTypeSelect(event) {
    if (event.target.value === '1') {
       this.correctAnswerInputType = 'radio';
       this.newAnswersArray.forEach(element => {
            this.deleteAnswerFromModal(element);
            this.addAnswer(); // set all answers false
       });
       }
    if (event.target.value === '2') {
        this.correctAnswerInputType = 'checkbox';
        this.newAnswersArray.forEach(element => {
          this.deleteAnswerFromModal(element);
          this.addAnswer(); // set all answers false
        });
       }
    if (event.target.value === '3') {
        this.correctAnswerInputType = 'txt';
        this.newAnswersArray.forEach(element => { element.true_answer = '1'; });
      }
    if (event.target.value === '4') {
        this.correctAnswerInputType = 'num';
        this.addAnswer(); // sets only two input fields for NUMERICAL answers type
    }
  }


   setQuestionType(elem: HTMLSelectElement) {
    const index = elem.options[elem.selectedIndex].index;
    this.new_question.type = '' + index;
  }

  setQuestionLevel(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    this.new_question.level = value;
  }

  setQuestionText(elem: HTMLSelectElement) {
    const value = elem.value;
    this.new_question.question_text = value;
  }

  setQuestionAttachment(event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () => this.new_question.attachment = fileReader.result;
    fileReader.readAsDataURL(img);
  }

  setAnsverAttachment(checkedIndex, event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () => this.newAnswersArray[checkedIndex].attachment = fileReader.result;
    fileReader.readAsDataURL(img);
  }

  /**
   *   verifies condition min_val<max_val
   */
  numericalIntervalLimitsValidator() {
    if (Number(this.newAnswersArray[0].answer_text) >= Number(this.newAnswersArray[1].answer_text)
    && this.newAnswersArray[0].answer_text !== '' && this.newAnswersArray[1].answer_text !== '') {
      this.isFirstNumberIncorrect = true;
      this.isSecondNumberIncorrect = true;
      this.form.get('0').setErrors({'incorrect': true});
      this.form.get('1').setErrors({'incorrect': true});
    } else {
      this.isFirstNumberIncorrect = false;
      this.isSecondNumberIncorrect = false;
      this.form.get('0').updateValueAndValidity();
      this.form.get('1').updateValueAndValidity();
    }
  }

  setAnsverText(checkedIndex, event) {
    const value = event.target.value;
    this.newAnswersArray[checkedIndex].answer_text = value;
    if (this.correctAnswerInputType === 'num') {
      this.numericalIntervalLimitsValidator();
    }
  }


  setAnswerCorrect(checkedIndex, event) {
      if (this.correctAnswerInputType === 'radio') {
        for (let index = 0; index < this.newAnswersArray.length; index++) {
          this.newAnswersArray[index].true_answer = (index === checkedIndex) ? '1' : '0';
        }
      }
      if (this.correctAnswerInputType === 'checkbox') {
        this.newAnswersArray[checkedIndex].true_answer =
        ( this.newAnswersArray[checkedIndex].true_answer === '0') ? '1' : '0';
      }
  }

  deleteAnswerFromModal(checkedIndex) {
    this.newAnswersArray.splice(checkedIndex, 1);
    this.answersIdNumbersArray.splice(checkedIndex, 1);
  }


addedQuestionSubmit() {
  let identicalAnswersNumber = 0;
  const questionJSON = JSON.stringify({
    test_id: this.selTestId,
    question_text: this.new_question.question_text,
    level: this.new_question.level,
    type: this.new_question.type,
    attachment: this.new_question.attachment
  });
    if ( this.data.questions.some(elem => elem.question_text === this.new_question.question_text ) ) {
      this.openModalMessage('Завдання з такою умовою вже існує! Введіть іншу умову завдання.');
        } else {

            if (this.newAnswersArray.length === 0 ) {
                  const dialogExit = this.dialog.open(DeleteConfirmComponent, {
                    width: '400px', data: {message: 'Відповіді не додано! Ви бажаєте зберегти завдання?'}
                  });
                  dialogExit.afterClosed().subscribe( (dialogResponse: boolean) => {
                  if (dialogResponse) { this.matDialogRef.close();
            this.questionService.addQuestion(questionJSON).subscribe((dataNewQuestions: IQuestion) => {});
                  } });
            } else {
                this.newAnswersArray.forEach((answer, index) => {
                  // checks if there is answer (with another answer index) with the same answerText
                  if ( this.newAnswersArray.some(element => (element.answer_text === answer.answer_text &&
                    this.newAnswersArray.indexOf(element) !== this.newAnswersArray.indexOf(answer))) ) {
                    identicalAnswersNumber += 1;
                    if (identicalAnswersNumber === 1) {
                        this.openModalMessage('Дублювання відповідей! Вiдредагуйте однакові відповіді.');
                    }
                  }
                    // if all answers are different
                    if (index === this.newAnswersArray.length - 1 && identicalAnswersNumber === 0) {
                  this.questionService.addQuestion(questionJSON).subscribe((dataNewQuestions: IQuestion) => {
                      this.openTooltip('Завдання та відповіді додано успішно!');
                      this.matDialogRef.close();
                        this.newAnswersArray.forEach(answ => {
                          answ.question_id = dataNewQuestions[0].question_id;
                          this.questionService.addAnswer(answ).subscribe(
                            (dataNewAnswers: IAnswer) => {}
                          );
                        });
                  });

                  }
                });

            }
        }
}

 openModalMessage(msg: string, w: string = '400px'): void {
  this.dialog.open(ResponseMessageComponent, {
      width: w,
      data: { message: msg }
  });
  }

  openTooltip(message) {
    this.snackBar.open(`${message}`, 'OK', {
        duration: 2000
    });
  }

  closeDialog() {
    this.matDialogRef.close();
  }

}
