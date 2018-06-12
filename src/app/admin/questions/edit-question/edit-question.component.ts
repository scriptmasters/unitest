import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {QuestionsService} from '../questions.service';
import {QuestionsComponent} from '../questions.component';
import {IAnswer, IQuestion, IResponse} from '../questions-interface';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DeleteConfirmComponent} from '../../../shared/delete-confirm/delete-confirm.component';
import {ResponseMessageComponent} from '../../../shared/response-message/response-message.component';


@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss'],
  providers: [QuestionsService]
})
export class EditQuestionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionsService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private matDialogRefPopUp: MatDialogRef<EditQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  public questionsComponent: QuestionsComponent;

  form: FormGroup;
  isFirstNumberIncorrect = false;
  isSecondNumberIncorrect = false;

  sel_question_test_name = this.data.sel_TestName;
  sel_question_id = this.data.sel_quest.question_id;
  sel_question_type = this.data.sel_quest.type;
  sel_question_test_id = this.data.sel_quest.test_id;

  sel_question: IQuestion = {
    question_id: this.data.sel_quest.question_id,
    test_id: this.data.sel_quest.test_id,
    question_text: this.data.sel_quest.question_text,
    level: this.data.sel_quest.level,
    type: this.data.sel_quest.type,
    attachment: this.data.sel_quest.attachment
  };
  edited_question: IQuestion = {
    question_id: this.data.sel_quest.question_id,
    test_id: this.data.sel_quest.test_id,
    question_text: this.data.sel_quest.question_text,
    level: this.data.sel_quest.level,
    type: this.data.sel_quest.type,
    attachment: this.data.sel_quest.attachment
  };

  receivedAnswersArray = [];
  editedAnswersArray = [];
  answersIdNumbersArray = [];
  correctAnswerInputType = 'radio';


  ngOnInit() {
    this.getAnswersOfSelectedQuestion(this.sel_question_id);
    this.setCorrectAnswerInputType();

    this.form = new FormGroup({
    });
  }


  setQuestionLevel(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    this.edited_question.level = value;
  }

  setQuestionText(elem: HTMLSelectElement) {
    const value = elem.value;
    this.edited_question.question_text = value;
  }

  setQuestionAttachment(event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () => {
      this.edited_question.attachment = fileReader.result;
    };
    fileReader.readAsDataURL(img);
  }

  resetQuestionAttachment() {
    this.edited_question.attachment = '';
  }

  getAnswersOfSelectedQuestion(question_id) {
    this.questionService.getAnswersByQuestionId(question_id).subscribe(data => {
      if (data.length) {
        this.receivedAnswersArray = [];
        data.forEach(element => this.receivedAnswersArray.push(JSON.stringify(element)) );
        this.editedAnswersArray = data;
        this.setAnswersIdNumbersArray();

        if (this.correctAnswerInputType === 'num') {
          const NUMBER_PATTERN = /[-+]?[0-9]*\.[0-9]+$|^[-+]?[0-9]+\.$|^[-+]?[0-9]*$/;
          this.form = new FormGroup({
          '0': new FormControl(this.editedAnswersArray[0].answer_text, [Validators.required, Validators.pattern(NUMBER_PATTERN)]),
          '1': new FormControl(this.editedAnswersArray[1].answer_text, [Validators.required, Validators.pattern(NUMBER_PATTERN)]),
          });
        }
      } else {
        this.receivedAnswersArray = [];
        this.editedAnswersArray = [];
      }
    });
  }


  setAnswersIdNumbersArray() {
    if (this.editedAnswersArray.length !== 0) {
      for (let i = 0; i < this.editedAnswersArray.length; i++) {
        if (this.answersIdNumbersArray[i] !== Number(this.editedAnswersArray[i].answer_id) ) {
          this.answersIdNumbersArray[i] = Number( this.editedAnswersArray[i].answer_id );
        }
      }
    }
  }


  addAnswer() {
    if (this.correctAnswerInputType === 'num') {
      if (this.editedAnswersArray.length === 0) {
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', '');
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', '');
        this.getAnswersOfSelectedQuestion(this.sel_question_id);
      }

    } else {

      this.editedAnswersArray.forEach((answer) => {
        answer.question_id = this.sel_question_id;
        if ( this.receivedAnswersArray.every(element =>  element !== JSON.stringify(answer) ) ) {
          this.questionService.editAnswer(answer.answer_id, answer)
          .subscribe((editedAnswer: IAnswer) => {  }  );
        }
      });

      if (this.correctAnswerInputType === 'txt') {
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', ''); // true_answer=1
      } else {
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '0', ''); // true_answer=0
      }

      this.form.addControl(
        (this.editedAnswersArray.length + 1).toString(),
        new FormControl('', [Validators.required])
      );

      this.getAnswersOfSelectedQuestion(this.sel_question_id);
    }
  }

  setCorrectAnswerInputType() {
    if (this.sel_question_type === '1') {
      this.correctAnswerInputType = 'radio';
    }
    if (this.sel_question_type === '2') {
      this.correctAnswerInputType = 'checkbox';
    }
    if (this.sel_question_type === '3') {
      this.correctAnswerInputType = 'txt';
    }
    if (this.sel_question_type === '4') {
      this.correctAnswerInputType = 'num';
    }
  }

  onQuestionTypeSelect(event) {
    this.edited_question.type = event.target.value;

    if (event.target.value === '1') {
      this.correctAnswerInputType = 'radio';
      this.editedAnswersArray.forEach(element => { element.true_answer = '0'; });
    }
    if (event.target.value === '2') {
      this.correctAnswerInputType = 'checkbox';
      this.editedAnswersArray.forEach(element => { element.true_answer = '0'; });
    }
    if (event.target.value === '3') {
      this.correctAnswerInputType = 'txt';
      this.editedAnswersArray.forEach(element => { element.true_answer = '1'; });
    }
    if (event.target.value === '4') {
      this.correctAnswerInputType = 'num';
      this.addAnswer(); // sets two input fields for NUMERICAL type
    }
  }


  setAnsverAttachment(checkedIndex, event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () =>
      (this.editedAnswersArray[checkedIndex].attachment = fileReader.result);
    fileReader.readAsDataURL(img);
  }

/**
 *   verifies condition if min_val < max_val
 */
  numericalIntervalLimitsValidator() {
      if (Number(this.editedAnswersArray[0].answer_text) >= Number(this.editedAnswersArray[1].answer_text)
      && this.editedAnswersArray[0].answer_text !== '' && this.editedAnswersArray[1].answer_text !== '') {
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
    this.editedAnswersArray[checkedIndex].answer_text = value;
    if (this.correctAnswerInputType === 'num') {
      this.numericalIntervalLimitsValidator();
    }
  }


  setAnswerCorrect(checkedIndex, event) {
    if (this.correctAnswerInputType === 'radio') {
      for (let index = 0; index < this.editedAnswersArray.length; index++) {
        this.editedAnswersArray[index].true_answer =
          index === checkedIndex ? '1' : '0';
      }
    }
    if (this.correctAnswerInputType === 'checkbox') {
      this.editedAnswersArray[checkedIndex].true_answer =
        this.editedAnswersArray[checkedIndex].true_answer === '0' ? '1' : '0';
    }
    if (this.correctAnswerInputType === 'txt' || this.correctAnswerInputType === 'num') {
      for (let index = 0; index < this.editedAnswersArray.length; index++) {
        this.editedAnswersArray[index].true_answer = '1';
      }
    }
  }


  insertNewAnswerToDataBase(
    questionId,
    answerText = '',
    trueAnswer = '',
    answerAttachment = ''
  ) {
    const newAnswerJSON = JSON.stringify({
      question_id: questionId,
      answer_text: answerText,
      true_answer: trueAnswer,
      attachment: answerAttachment
    });
    this.questionService.addAnswer(newAnswerJSON).subscribe((dataNewAnswer: IAnswer) => dataNewAnswer);
  }

  deleteAnswerfromModal(checkedIndex) {
    this.editedAnswersArray.splice(checkedIndex, 1);
      this.answersIdNumbersArray.splice(checkedIndex, 1);
  }


  deleteAnswerFromDataBase(checkedIndex): void {
    const checkedAnswerId = this.editedAnswersArray[checkedIndex].answer_id;
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '400px',
      data: { message: 'Ви бажаєте видалити відповідь з бази даних?' }
    });

    dialogRef.afterClosed().subscribe( (dialogResponse: boolean) => {
      if (dialogResponse) {
        this.questionService.deleteAnswer(checkedAnswerId).subscribe(
          (data: IResponse) => {
            if (data.response === 'ok') {
              this.deleteAnswerfromModal(checkedIndex);
              this.openTooltip('Відповідь з бази даних видалено!');
            }
          },
          () => {
            this.openModalMessage('Виникла помилка при видаленні цієї відповіді з бази даних!');
          }
        );
      }
    });
  }


  editedQuestionSubmit() {
    let editedAnswersNumber = 0;
    let identicalAnswersNumber = 0;
    const questionJSON = JSON.stringify({
      question_id: this.sel_question_id,
      test_id: this.data.sel_quest.test_id,
      question_text: this.edited_question.question_text,
      level: this.edited_question.level,
      type: this.edited_question.type,
      attachment: this.edited_question.attachment
    });

      // updates question to database if it was changed
      if ( JSON.stringify(this.edited_question) !== JSON.stringify(this.sel_question) ) {
        // checks if there is another question (question_id) with the same questionText
        if ( this.data.questions.some(element => element.question_text === this.edited_question.question_text &&
                                                 element.question_id !== this.edited_question.question_id )
        ) { this.openModalMessage('Завдання з такою умовою вже існує! Введіть іншу умову завдання.');
        } else {
          this.questionService.editQuestion(this.sel_question_id, questionJSON)
              .subscribe((editedQuestion: IQuestion) => {
                this.openTooltip('Завдання відредаговано успішно!');
                this.matDialogRefPopUp.close();
              });
        }
      } else { // if question and any answers weren't edited
        if ( '[' + this.receivedAnswersArray.toString() + ']' === JSON.stringify(this.editedAnswersArray) ) {
          const dialogExit = this.dialog.open(DeleteConfirmComponent, {
            width: '400px', data: {message: 'Завдання не відредаговано! Ви бажаєте вийти?'}
          });
          dialogExit.afterClosed().subscribe( (dialogResponse: boolean) => {
          if (dialogResponse) { this.matDialogRefPopUp.close(); } });
        }
      }

    this.editedAnswersArray.forEach((answer, index) => {
      answer.question_id = this.sel_question_id;
        // checks if there is another answer (answer_id) with the same answerText
        if ( this.editedAnswersArray.some(element => element.answer_text === answer.answer_text &&
                                                     element.answer_id !== answer.answer_id )
        ) {
          identicalAnswersNumber += 1;
          if (identicalAnswersNumber === 1) {
              this.openModalMessage('Дублювання відповідей! Вiдредагуйте однакові відповіді.');
          }
        }
      if (index === this.editedAnswersArray.length - 1 && identicalAnswersNumber === 0) {
        this.editedAnswersArray.forEach((answ, i) => {
          // updates only those answers that were changed
          if (  this.receivedAnswersArray.every(element =>  element !== JSON.stringify(answ) ) ) {
            this.questionService.editAnswer(answ.answer_id, answ).subscribe(
              (editedAnswer: IAnswer) => { // each edited answer that returned from data base is rewrited to receivedAnswersArray
                this.receivedAnswersArray[i] = JSON.stringify(editedAnswer);
              },
              () => { this.openModalMessage('Виникла помилка при редагуванні цієї відповіді в базі даних!'); },
              () => { // onComplete
                editedAnswersNumber += 1;
                if (editedAnswersNumber === 1) {
                  this.openTooltip('Відповіді відредаговано успішно!');
                  this.matDialogRefPopUp.close();
                }
              }
            );
          }
        });
      }
    });

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


  closeDialog(): void {
    this.matDialogRefPopUp.close();
  }
}
