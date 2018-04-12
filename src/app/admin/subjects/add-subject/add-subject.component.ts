import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OnDestroy} from '@angular/core';
import {ISubscription} from 'rxjs/Subscription';

import {SubjectService} from '../services/subject.service';
import {Subject} from '../subject';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent implements OnInit, OnDestroy {

  private subscription: ISubscription;
  subjects: Subject[];
  form: FormGroup;
  error;

  constructor(
    private subjectService: SubjectService,
    private matDialogRef: MatDialogRef<AddSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
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

  onSubmit() {
    const formData = this.form.value;
    this.subscription = this.subjectService.addSubject(formData.title, formData.description)
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
