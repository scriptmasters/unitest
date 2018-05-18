import {Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionsService} from '../questions.service';
// import {QuestionsComponent} from '../questions.component';
import {IQuestion, IAnswerSet, IAnswer, IResponse} from '../questions-interface';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { ResponseMessageComponent } from '../../../shared/response-message/response-message.component';


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
  providers: [ QuestionsService ]
})
export class AddQuestionComponent implements OnInit {


 form;
 correctAnswerInputType = 'radio';
//  answerResourse = 'text_file';
 answersIdNumbersArray = [];
//  correctAnswers = [];
 newAnswersArray = [];


 questionForm = new FormGroup ({
    // question_text: new FormControl('', Validators.required),
    // level: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^([1-9]|1[0-9]|20)$/)])),
    // type: new FormControl('1', Validators.required),
    // '0': new FormControl('', Validators.required)
  });


 selTestId: string;
 selTestName: string;

 new_question: IQuestion = {
    test_id: this.selTestId,
    question_id: '',
    question_text: 'no text',
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
  @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {

    this.selTestId = this.data.sel_TestId;
    this.selTestName = this.data.sel_TestName;

    console.log('selTestId = ', this.selTestId, ', selTestName = ', this.selTestName);

    console.log('answersIdNumbersArray = ', this.answersIdNumbersArray);
    console.log('newAnswersArray = ', this.newAnswersArray);

    this.form = new FormGroup({
      '0': new FormControl('', [Validators.required,
        Validators.pattern(/[-+]?[0-9]*\.[0-9]+$|^[-+]?[0-9]+\.$|^[-+]?[0-9]*$/)]),
      '1': new FormControl('', [Validators.required,
        Validators.pattern(/[-+]?[0-9]*\.[0-9]+$|^[-+]?[0-9]+\.$|^[-+]?[0-9]*$/)])
      }, { updateOn: 'blur' });

  }


  addAnswer() {
    if (this.correctAnswerInputType === 'num' ) {
         this.answersIdNumbersArray = [1, 2];
         this.newAnswersArray = [{}, {}];
         this.newAnswersArray.forEach(element => {  element.true_answer = '1'; element.attachment = ''; });

        //  this.questionForm.addControl(  (this.newAnswersArray.length).toString() ,
        //                                   new FormControl('', [Validators.required] )
        //                              );
    } else {

      this.questionForm.addControl(  (this.newAnswersArray.length + 1).toString() ,
                                      new FormControl('', [Validators.required] ) );
                  // this.answersIdNumbersArray.push( this.answersIdNumbersArray.length + 1);
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
                // console.log('this.answersIdNumbersArray = ', this.answersIdNumbersArray);
                console.log('this.newAnswersArray = ', this.newAnswersArray);
  }


  onAnswerTypeSelect(event) {
    console.log('onAnswerTypeSelect = ', event.target.value);
    if (event.target.value === '1') {
       this.correctAnswerInputType = 'radio';
       this.newAnswersArray.forEach(element => {
            this.deleteAnswerFromModal(element);
            this.addAnswer(); // set all answers false
            // element.true_answer = '0'; - doesn't uncheck FormControl with max number checked previously
       });
       }
    if (event.target.value === '2') {
        this.correctAnswerInputType = 'checkbox';
        this.newAnswersArray.forEach(element => {
          this.deleteAnswerFromModal(element);
          this.addAnswer(); // set all answers false
          // element.true_answer = '0'; - doesn't uncheck FormControl with max number checked previously
        });
       }
    if (event.target.value === '3') {
        this.correctAnswerInputType = 'txt';
        this.newAnswersArray.forEach(element => { element.true_answer = '1'; }); // set all answers correct
      }
    if (event.target.value === '4') {
        this.correctAnswerInputType = 'num';
        this.addAnswer(); // sets only two input fields for NUMERICAL answers type
    }
    console.log('correctAnswerInputType = ', this.correctAnswerInputType);
    console.log(' this.newAnswersArray = ',  this.newAnswersArray);
  }


   setQuestionType(elem: HTMLSelectElement) {
    const index = elem.options[elem.selectedIndex].index; // + 1; // починаємо нумерацію з одиниці
    this.new_question.type = '' + index;
    console.log('type_index = ', index);
  }

  setQuestionLevel(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    this.new_question.level = value;
    console.log('level = ', value);
  }

  setQuestionText(elem: HTMLSelectElement) {
    const value = elem.value;
    this.new_question.question_text = value;
    console.log('QuestionText = ', value);
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
    console.log('this.newAnswersArray = ', this.newAnswersArray);
  }

  setAnsverText(checkedIndex, event) {
    const value = event.target.value;
    this.newAnswersArray[checkedIndex].answer_text = value;
    // verifies condition min_val<max_val
    if (this.correctAnswerInputType === 'num' && checkedIndex === 0 && this.newAnswersArray[1].answer_text !== '') {
      if (this.newAnswersArray[0].answer_text >= this.newAnswersArray[1].answer_text ) {
        this.openModalMessage('Максимальне значення має більшим за мінімальне!');
      }
    }
    if (this.correctAnswerInputType === 'num' && checkedIndex === 1) {
      if (this.newAnswersArray[0].answer_text >= this.newAnswersArray[1].answer_text ) {
        this.openModalMessage('Максимальне значення має більшим за мінімальне!');
      }
    }
    console.log('this.newAnswersArray = ', this.newAnswersArray);
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
      console.log(`this.newAnswersArray = `, this.newAnswersArray);
  }

  deleteAnswerFromModal(checkedIndex) {
    this.newAnswersArray.splice(checkedIndex, 1);
    this.answersIdNumbersArray.splice(checkedIndex, 1);
    console.log(`this.newAnswersArray = `, this.newAnswersArray);
    // console.log(`this.answersIdNumbersArray = `, this.answersIdNumbersArray);
  }


addedQuestionSubmit() {
  const questionJSON = JSON.stringify({
    test_id: this.selTestId,
    question_text: this.new_question.question_text,
    level: this.new_question.level,
    type: this.new_question.type,
    attachment: this.new_question.attachment
  });

    this.questionService.addQuestion(questionJSON).subscribe((dataNewQuestions: IQuestion) => {
      if (dataNewQuestions) {

        console.log('dataNewQuestions = ', dataNewQuestions);

          this.newAnswersArray.forEach(answer => {
              answer.question_id = dataNewQuestions[0].question_id;
              console.log('new answer = ', answer);
              this.questionService.addAnswer(answer).subscribe(
                   (dataNewAnswers: IAnswer) =>
                    console.log('Respond: newAnswers_id = ', dataNewAnswers)
              );
              });

        this.matDialogRef.close();
      }
    });

}

 // Dialog modal message
 openModalMessage(msg: string, w: string = '400px'): void {
  this.dialog.open(ResponseMessageComponent, {
      width: w,
      data: { message: msg }
  });
}

closeDialog() {
  this.matDialogRef.close();
}

}
