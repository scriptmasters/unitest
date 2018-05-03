import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {TestService } from '../test.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgClass} from '@angular/common';
import { ResponseMessageComponent } from '../../../shared/response-message/response-message.component';
import {forbiddenCharValidator} from '../tests-validator.directive';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditComponent implements OnInit {

rForm: FormGroup;
enabled = [{value: 1, text: 'Доступний'}, {value: 0, text: 'Недоступний'}];
constructor(public dialogRef: MatDialogRef<EditComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
            private httpService: TestService, private fb: FormBuilder, public dialog: MatDialog) {
this.initForm();
}
ngOnInit() {}
initForm() {
  this.rForm = this.fb.group({
    test_name: [this.data.test.test_name, [Validators.required, Validators.maxLength(70), Validators.minLength(2),
        forbiddenCharValidator(/^\s/i)]],
    tasks: [this.data.test.tasks, [Validators.required, Validators.maxLength(3), forbiddenCharValidator(/\D/i)]],
    time_for_test: [this.data.test.time_for_test, [Validators.required, Validators.maxLength(3), forbiddenCharValidator(/\D/i)]],
    enabled: [this.data.test.enabled['value'], [Validators.required]],
    subject_id: [this.data.test.subject_id , [Validators.required]],
    attempts: [this.data.test.attempts, [Validators.required, Validators.maxLength(2), forbiddenCharValidator(/\D/i)]],
  });
}



onSubmit() {
  const controls = this.rForm.controls;
  if (this.rForm.invalid) {
Object.keys(controls)
    .forEach(controlName => controls[controlName].markAsTouched());
    return;
    }
   this.httpService.editTest(this.data.id, this.rForm.value).subscribe(
    () => {},
    (err) => {
      this.dialogRef.close();
      if (err.status === 400) {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Ви не внесли жодних змін!'
        }
      });
    }
  },
    () => {
      this.dialogRef.close();
      const matDialogRef = this.dialog.open(ResponseMessageComponent, {
        width: '350px',
        data: {message: 'Зміни збережено'}
      });
    }
  );
}

onNoClick() {
  this.dialogRef.close(true);
}

get test_name() {
  return this.rForm.get('test_name');
}

get attempts() {
  return this.rForm.get('attempts');
}
get tasks() {
  return this.rForm.get('tasks');
}
get time_for_test() {
  return this.rForm.get('time_for_test');
}
get status() {
  return this.rForm.get('enabled');
}
}
