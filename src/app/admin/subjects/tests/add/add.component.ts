import { Component, OnInit, Inject } from '@angular/core';
import { Test } from '../test';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TestService } from '../test.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubjectService } from '../../services/subject.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  rForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private httpService: TestService, private fb: FormBuilder) {
  this.initForm();
  }

  ngOnInit() {

  }

initForm() {
  this.rForm = this.fb.group({
    test_name: [, [Validators.required,
      Validators.maxLength(70), Validators.minLength(2)]
  ],
    tasks: [, [Validators.required,
    Validators.pattern(/^\d{1,3}$/)]],
    time_for_test: [, [Validators.required,
    Validators.pattern(/[0-9]/)]
  ],
    enabled: [, [Validators.required]],

    subject_id: [this.data.id, Validators.required],
    attempts: [, [Validators.required, Validators.pattern(/\d{1,3}/)]]
  });
}

enabled = [{value: 1, text: 'Доступний'}, {value: 0, text: 'Недоступний'}];

onSubmit() {
  const controls = this.rForm.controls;
  if (this.rForm.invalid) {
  /** якщо форма не валідна то помічаємо всі контроли як touched*/
  Object.keys(controls)
    .forEach(controlName => controls[controlName].markAsTouched());
    return;
    }
  /*Опрацювання даних форми*/
   this.httpService.addTest(this.rForm.value).subscribe(
    () => console.log(),
    () => console.log(),
    () => this.dialogRef.close()
  );
  }
}

