import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { QuestionsService } from '../questions.service';

import { IQuestions } from '../questions-interface';


@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})


export class EditQuestionComponent implements OnInit {

//  subject: Subject;
  question: IQuestions;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private matDialogRef: MatDialogRef<EditQuestionComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private questionService: QuestionsService
  ) { }


  ngOnInit() {
    this.getQuestion();

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });
  }

  getQuestion() {
    const id = this.data.question_id;
    this.questionService.getQuestionById(id)
      .subscribe((data: IQuestions) => {
        this.question = data;
      });
  }

  onSubmit() {
    const id = this.data.question_id;
    const formData = this.form.value;
    this.questionService.editQuestion(id, formData.title, formData.description)
      .subscribe((data: IQuestions) => {
        if (data) {
          this.matDialogRef.close();
        }
      });
  }

  closeDialog() {
    this.matDialogRef.close();
  }

}

