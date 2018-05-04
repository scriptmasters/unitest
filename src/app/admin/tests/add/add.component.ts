import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { TestService } from '../test.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ResponseMessageComponent } from '../../../shared/response-message/response-message.component';
import {forbiddenCharValidator} from '../tests-validator.directive';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  rForm: FormGroup;
  subjects;
  s_id;
  enabled = [{value: 1, text: 'Доступний'}, {value: 0, text: 'Недоступний'}];
  constructor(public dialogRef: MatDialogRef<AddComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private httpService: TestService, private fb: FormBuilder, public dialog: MatDialog) {
    this.initForm();
  }
ngOnInit() {
    this.getSubjects();
}
initForm() {
  this.rForm = this.fb.group({
  test_name: ['', [Validators.required, Validators.maxLength(70), Validators.minLength(2), forbiddenCharValidator(/^\s/i)]],
  tasks: ['', [Validators.required, Validators.maxLength(3), forbiddenCharValidator(/\D/i)]],
  time_for_test: ['', [Validators.required, Validators.maxLength(3), forbiddenCharValidator(/\D/i)]],
  enabled: ['', [Validators.required]],
  subject_id: [this.s_id, Validators.required],
  attempts: ['', [Validators.required, Validators.maxLength(2), forbiddenCharValidator(/\D/i)]]
  });
}

onSubmit() {
  const controls = this.rForm.controls;
  if (this.rForm.invalid) {
  /** якщо форма не валідна то помічаємо всі контроли як touched*/
  Object.keys(controls)
    .forEach(controlName => controls[controlName].markAsTouched());
    return;
    }
    // Опрацювання даних форми
   this.httpService.addTest(this.rForm.value).subscribe(
    () => {this.dialogRef.close();
      const matDialogRef = this.dialog.open(ResponseMessageComponent, {
        width: '400px',
        data: {message: 'Тест успішно додано'}
      });
    },
    (err) => {
      if (err.status === 400) {
        this.dialogRef.close();
        this.dialog.open(ResponseMessageComponent, {
          width: '350px',
          data: {
            message: 'Предмета з таким id не існує'
          }
        });
      }
  }
  );
  }
  getSubjects() {
    this.httpService.getSubjects().subscribe(
      (data) => this.subjects = data);
  }
  onNoClick() {
    this.dialogRef.close();
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

  get subject_id() {
    return this.rForm.get('subject_id');
  }
}

