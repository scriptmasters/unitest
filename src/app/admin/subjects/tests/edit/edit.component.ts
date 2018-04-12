import { Component, Inject, OnInit} from '@angular/core';
import { Test } from '../test';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {TestService } from '../test.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  
  rForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<EditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private httpService: TestService, private fb: FormBuilder) { 
  this.initForm();
  }
  
  ngOnInit() {
  
  }
  
initForm() {
  this.rForm = this.fb.group({
    test_name: [this.data.test.test_name, [Validators.required,
    Validators.maxLength(70), Validators.minLength(2)]
  ],
    tasks: [this.data.test.tasks, [Validators.required,Validators.pattern(/^\d{1,3}$/)]
  ],
    time_for_test: [this.data.test.time_for_test, [Validators.required,
    Validators.pattern(/\d\d:\d\d:\d\d/)]
  ],
    enabled: [this.data.test.enabled['value'], [Validators.required]],

    subject_id: [this.data.test.subject_id['value'], [Validators.required]],

    attempts: [this.data.test.attempts, [Validators.required,
    Validators.pattern(/\d{1,3}/)]
  ]
  })
}

enabled = [{value: 1, text: 'Доступний'}, {value: 0, text: 'Недоступний'}];
subject_id = [{value: 1, text: 'Вища математика'}, {value: 2, text: 'Теорія ймовірності'}];

onSubmit() {
  const controls = this.rForm.controls;
  if (this.rForm.invalid) {
  /** Если форма не валидна, то помечаем все контролы как touched*/
  Object.keys(controls)
    .forEach(controlName => controls[controlName].markAsTouched());
    return;
    }
   /** TODO: Обработка данных формы */
   this.httpService.editTest(this.data.id, this.rForm.value).subscribe(
    () => console.log(),
    () => console.log(),
    () => this.dialogRef.close()
  )
  } 
}
