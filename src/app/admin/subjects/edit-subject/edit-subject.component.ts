import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {OnDestroy} from '@angular/core';
import {ISubscription} from 'rxjs/Subscription';

import {SubjectService} from '../services/subject.service';
import {Subject} from '../subject';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.scss']
})
export class EditSubjectComponent implements OnInit, OnDestroy {

  private subscription: ISubscription;
  subject: Subject[];
  form: FormGroup;
  error;
  isLoaded = false; // for checking status download data

  constructor(
    private route: ActivatedRoute,
    private matDialogRef: MatDialogRef<EditSubjectComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private subjectService: SubjectService
  ) { }

  ngOnInit() {
    this.getSubject();

    this.form = new FormGroup({
      'title': new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      'description': new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ])
    });
  }

  getSubject(): void {
    const id = this.data.subject_id;
    this.subscription = this.subjectService.getSubjectById(id)
      .subscribe((subject: Subject[]) => {
        this.subject = subject;
        this.isLoaded = true;
      });
  }

  onSubmit() {
    const id = this.data.subject_id;
    const formData = this.form.value;
    console.log(this.form);
    this.subscription = this.subjectService.editSubject(id, formData.title, formData.description)
      .subscribe((subject: Subject[]) => {
        if (subject) {
          return this.matDialogRef.close();
        }
      },
        error => this.error = error
      );
  }

  closeDialog(): void {
    this.matDialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
