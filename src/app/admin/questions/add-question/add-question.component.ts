import {Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { QuestionsService } from '../questions.service';
/*import { QuestionsComponent } from '../questions.component';*/

import { IQuestions } from '../questions-interface';
import { IQuestionAdd } from '../questions-interface';

import { IResponse } from '../questions-interface';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
  providers: [ QuestionsService ]
})
export class AddQuestionComponent implements OnInit {
  @Input()

form;
 questions: IQuestions[];
 selTestId: string;

 new_question: IQuestionAdd = {
    test_id: '', // this.questionsComponentInstance.selectedTestId,
    question_text: 'some text',
    level: '',
    type_index: '',
    type_name: '',
    attachment: ''
};

constructor(
  private questionService: QuestionsService,
  private matDialogRef: MatDialogRef<AddQuestionComponent>
) { }

  ngOnInit() {
    console.log('QuestionsComponent.selectedTestId = ',/* QuestionsComponent.selectedTestId*/);

    this.questionService.getAllQuestions()
      .subscribe((dataQuestions: IQuestions[]) => {
        this.questions = dataQuestions;
      });

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });

  }



  setQuestionType(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    const index = elem.options[elem.selectedIndex].index + 1; // починаємо нумерацію з одиниці
    this.new_question.type_name = value;
    this.new_question.type_index = '' + index;
    console.log('type_index = ', index, ' type_name = ', value);

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

  setVariantsNumber(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    console.log('Variants number = ', value);
  }

  setResourse(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    this.new_question.attachment = value;
    console.log('Attachment = ', value);
  }



  closeDialog() {
    this.matDialogRef.close();
  }

addQuestionSubmit() {

  const questionJSON = JSON.stringify({

    /*test_id: QuestionsComponent.selectedTestId,*/
    question_text: this.new_question.type_name + ' [ ' + this.new_question.question_text + ' ]',
    level: this.new_question.level,
    type: this.new_question.type_index,
    attachment: this.new_question.attachment
  });

  console.log('questionJSON = ', questionJSON);

  this.questionService.addQuestion(questionJSON).subscribe((dataQuestions: IResponse) => {
    if (dataQuestions.response === 'ok') {
      this.matDialogRef.close();
    }
  });

}

}
