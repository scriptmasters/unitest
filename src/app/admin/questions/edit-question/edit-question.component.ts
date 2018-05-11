import {Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuestionsService } from '../questions.service';
import { QuestionsComponent } from '../questions.component';
import { IQuestions, IQuestionGet, IQuestionSet, IAnswersGet, IAnswerSet, IResponse } from '../questions-interface';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DeleteConfirmComponent } from '../../../shared/delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from '../../../shared/response-message/response-message.component';

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
    private dialog: MatDialog, // for deleting answer confirmation
    private matDialogRefPopUp: MatDialogRef<EditQuestionComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {}



  public questionsComponent: QuestionsComponent;

  form: FormGroup;

  sel_question_test_name = this.data.sel_TestName;

  sel_question_id = this.data.sel_quest.question_id;
  sel_question_type = this.data.sel_quest.type;
  sel_question_test_id = this.data.sel_quest.test_id;

  // sel_question.type

  sel_question: IQuestionGet = {
    question_id: this.data.sel_quest.question_id,
    test_id: this.data.sel_quest.test_id,
    question_text: this.data.sel_quest.question_text,
    level: this.data.sel_quest.level,
    type: this.data.sel_quest.type,
    attachment: this.data.sel_quest.attachment
  };

  edited_question: IQuestionSet = {
    test_id: this.data.sel_quest.test_id,
    question_text: this.data.sel_quest.question_text,
    level: this.data.sel_quest.level,
    type: this.data.sel_quest.type,
    attachment: this.data.sel_quest.attachment
  };

  // за  sel_question_id з бази витягуємо всі asnswers!
  editedAnswersArray = [];
  answersIdNumbersArray = [];
  // newAnswersArray = [];
  correctAnswerInputType = 'radio';
  answersResourse = 'text_file';

  questionForm = new FormGroup({
    // question_text: new FormControl('', Validators.required),
    // level: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^([1-9]|1[0-9]|20)$/)])),
    // type: new FormControl('1', Validators.required),
    // '0': new FormControl('', Validators.required)
  });

  ngOnInit() {
    console.log('this.sel_question OnInit = ', this.sel_question);
    console.log('this.data.sel_TestName = ', this.data.sel_TestName);

    this.getAnswersOfSelectedQuestion(this.sel_question_id);
    this.setCorrectAnswerInputType();

    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    }, { updateOn: 'blur' });
  }

  // getQuestion() {
  //   this.questionService.getQuestionById(this.data.sel_quest_id).subscribe((data: IQuestionGet) => {
  //       this.sel_question = data[0];
  //       console.log('getQuestion this.sel_question = ', this.sel_question);
  //     });
  //   console.log('getQuestion outer this.sel_question = ', this.sel_question);
  // }

  setQuestionType(elem: HTMLSelectElement) {
  //   const value = elem.options[elem.selectedIndex].value;
  //   const index = elem.options[elem.selectedIndex].index + 1; // починаємо нумерацію з одиниці
  //   this.edited_question.type_name = value;
  //   this.edited_question.type = '' + index;
  //   console.log('from setQuestionType: type = ', index, ' type_name = ', value);
  }

  setQuestionLevel(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    this.edited_question.level = value;
    console.log('level = ', value);
  }

  setQuestionText(elem: HTMLSelectElement) {
    const value = elem.value;
    this.edited_question.question_text = value;
    console.log('QuestionText = ', value);
  }

  setQuestionAttachment(event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () => {
      this.edited_question.attachment = fileReader.result;
      this.sel_question.attachment = this.edited_question.attachment;
    };
    fileReader.readAsDataURL(img);
  }

  resetQuestionAttachment() {
    this.edited_question.attachment = '';
    this.sel_question.attachment = '';
  }

  getAnswersOfSelectedQuestion(question_id) {
    this.questionService.getAnswersByQuestionId(question_id).subscribe(data => {
      if (data.length) {
        this.editedAnswersArray = data;
        console.log(
          'from getAnswersOfSelectedQuestion: this.editedAnswersArray = ',
          this.editedAnswersArray
        );
        this.setAnswersIdNumbersArray();
      } else {
        this.editedAnswersArray = [];
        // alert(' Вибране завдання ще не має відповідей. Додайте відповіді');
      }
    });
  }

  // set the array of id of received answers (if they exist) of the selected question
  setAnswersIdNumbersArray() {
    if (this.editedAnswersArray.length === 0) {
      console.log(
        'Завдання ще немає відповідей this.answersIdNumbersArray = ',
        this.answersIdNumbersArray
      );
    } else {
      for (let i = 0; i < this.editedAnswersArray.length; i++) {
        if (this.answersIdNumbersArray[i] !== Number(this.editedAnswersArray[i].answer_id) ) {
          this.answersIdNumbersArray[i] = Number( this.editedAnswersArray[i].answer_id );
        }
      }
    }
    console.log('from setAnswersIdNumbersArray: answersIdNumbersArray = ', this.answersIdNumbersArray);
  }

  addAnswer() {
    if (this.correctAnswerInputType === 'num') {
      if (this.editedAnswersArray.length === 0) {
        // creates two new answers
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', '');
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', '');
        this.getAnswersOfSelectedQuestion(this.sel_question_id);
      }

      if (this.editedAnswersArray.length === 1) {
        // one answer is edited and second is created
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', '');
        this.getAnswersOfSelectedQuestion(this.sel_question_id);
      }

      if (this.editedAnswersArray.length >= 2) {
        // 1-st and 2-nd answers ere edited and rest is deleted
        for (let i = this.editedAnswersArray.length - 1; i >= 2; i--) {
          this.deleteAnswer(i);
        }
      }
    } else {
      if (this.correctAnswerInputType === 'txt') {
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', ''); // true_answer=1
      } else {
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '0', ''); // true_answer=0
      }
      this.getAnswersOfSelectedQuestion(this.sel_question_id);
    }
    this.questionForm.addControl(
      (this.editedAnswersArray.length + 1).toString(),
      new FormControl('', [Validators.required])
    );
    console.log('from addAnswer: this.answersIdNumbersArray = ', this.answersIdNumbersArray);
    console.log('from addAnswer: this.editedAnswersArray = ', this.editedAnswersArray);
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
    console.log(
      'from setCorrectAnswerInputType: correctAnswerInputType = ',
      this.correctAnswerInputType
    );
  }

  onQuestionTypeSelect(event) {
    this.edited_question.type = event.target.value;

    if (event.target.value === '1') {
      this.correctAnswerInputType = 'radio';
    }
    if (event.target.value === '2') {
      this.correctAnswerInputType = 'checkbox';
    }
    if (event.target.value === '3') {
      this.correctAnswerInputType = 'txt';
      this.editedAnswersArray.forEach(element => {
        element.true_answer = '1';
      }); // set all answers correct
    }
    if (event.target.value === '4') {
      this.correctAnswerInputType = 'num';
      this.addAnswer(); // sets only two input fields for NUMERICAL answers type
    }
    console.log('from onQuestTypeSelect: AnsType = ',  this.correctAnswerInputType, ', edQuestType = ', this.edited_question.type);
    console.log('from onQuestionTypeSelect: edited_question = ', this.edited_question);
    console.log('from onQuestionTypeSelect: editedAnswersArray = ', this.editedAnswersArray);
  }


  setAnsverAttachment(checkedIndex, event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () =>
      (this.editedAnswersArray[checkedIndex].attachment = fileReader.result);
    fileReader.readAsDataURL(img);
    console.log('this.editedAnswersArray = ', this.editedAnswersArray);
  }

  setAnsverText(checkedIndex, event) {
    const value = event.target.value;
    this.editedAnswersArray[checkedIndex].answer_text = value;
    console.log('this.editedAnswersArray = ', this.editedAnswersArray);
    console.log(
      `editedAnswersArray[${checkedIndex}].answer_text = `,
      this.editedAnswersArray[checkedIndex].answer_text
    );
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
    if (
      this.correctAnswerInputType === 'txt' ||
      this.correctAnswerInputType === 'num'
    ) {
      for (let index = 0; index < this.editedAnswersArray.length; index++) {
        this.editedAnswersArray[index].true_answer = '1';
      }
    }
    console.log(`this.editedAnswersArray = `, this.editedAnswersArray);
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
    console.log('newAnswerJSON = ', newAnswerJSON);

    this.questionService.addAnswer(newAnswerJSON).subscribe((dataNewAnswer: IAnswersGet) =>
        console.log('Respond: added new answer = ', dataNewAnswer)
      );
  }

  deleteAnswer(checkedIndex) {
    this.deleteAnswerFromDataBase(
      this.editedAnswersArray[checkedIndex].answer_id
    );
    this.editedAnswersArray.splice(checkedIndex, 1);
    this.answersIdNumbersArray.splice(checkedIndex, 1);
    console.log(
      `from deleteAnswer: this.answersIdNumbersArray = `,
      this.answersIdNumbersArray
    );
    console.log(
      `from deleteAnswer: this.editedAnswersArray = `,
      this.editedAnswersArray
    );
  }

  deleteAnswerFromDataBase(checkedAnswerId): void {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '400px',
      data: {
        message: 'Ви бажаєте видалити відповідь з бази даних?'
      }
    });

    dialogRef.afterClosed().subscribe((Response: boolean) => {
      if (Response) {
        this.questionService.deleteAnswer(checkedAnswerId).subscribe(
          (data: IResponse) => {
            if (data.response === 'ok') {
              this.dialog.open(ResponseMessageComponent, {
                width: '400px',
                data: { message: 'Відповідь з бази даних видалено!' }
              });
            }
          },
          () => {
            // this function shows window when deleteAnswer(answer_id).subscribe returns error
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message:
                  'Виникла помилка при видаленні цієї відповіді з бази даних!'
              }
            });
          }
        );
      }
    });
  }

  editedQuestionSubmit() {
    const questionJSON = JSON.stringify({
      question_id: this.sel_question_id,
      test_id: this.data.sel_quest.test_id,
      question_text: this.edited_question.question_text,
      level: this.edited_question.level,
      type: this.edited_question.type,
      attachment: this.edited_question.attachment
    });

    this.questionService
      .editQuestion(this.sel_question_id, questionJSON).subscribe((response: IQuestionGet) => {
        console.log('response = ', response);

          if (response) {
          this.editedAnswersArray.forEach(answer => {
            answer.question_id = this.sel_question_id;
            console.log('edited answer = ', answer);
            this.questionService.editAnswer(answer.answer_id, answer).subscribe((editedAnswersData: IAnswersGet) => {
                console.log('Respond: editedAnswersData = ', editedAnswersData);
              });
          });
          this.matDialogRefPopUp.close();
        } else {

        }
      });
  }

  closeDialog(): void {
    this.matDialogRefPopUp.close();
  }
}
