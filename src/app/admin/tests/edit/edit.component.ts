import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {TestService} from '../test.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponseMessageComponent} from '../../../shared/response-message/response-message.component';
import {forbiddenCharValidator} from '../tests-validator.directive';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditComponent implements OnInit {

rForm: FormGroup;
subjects;
en;
dis;
enabled;
constructor(public dialogRef: MatDialogRef<EditComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
            private httpService: TestService, private fb: FormBuilder, public dialog: MatDialog,
            public translate: TranslateService) {
this.initForm();
}
ngOnInit() {
  this.getSubjects();
  this.translate.get('ENABLED').subscribe(msg => {
    this.en = msg;
  });
  this.translate.get('DISABLED').subscribe(msg => {
    this.dis = msg;
  });
  this.enabled = [{value: 1, text: this.en}, {value: 0, text: this.dis}];
}
initForm() {
  this.rForm = this.fb.group({
    test_name: [this.data.test.test_name, [Validators.required, Validators.maxLength(70), Validators.minLength(2),
      forbiddenCharValidator(/^\s/i)]],
    tasks: [this.data.test.tasks, [Validators.required, Validators.maxLength(3), forbiddenCharValidator(/\D/i)]],
    time_for_test: [this.data.test.time_for_test, [Validators.required, Validators.maxLength(3), forbiddenCharValidator(/\D/i)]],
    enabled: [this.data.test.enabled['value'], [Validators.required]],
    subject_id: [this.data.test.subject_id, [Validators.required]],
    attempts: [this.data.test.attempts, [Validators.required, Validators.maxLength(2), forbiddenCharValidator(/\D/i)]]
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
        this.translate.get('ADMIN.TEST.NCHANGES').subscribe(msg => {
          this.dialog.open(ResponseMessageComponent, {
            width: '350px',
            data: {
              message: msg
        }
      });
        });
    } else {
      this.translate.get('ADMIN.TEST.ERR').subscribe(msg => {
        this.dialog.open(ResponseMessageComponent, {
          width: '350px',
          data: {
            message: msg
      }
    });
      });
    }
  },
    () => {
      this.dialogRef.close();
      this.translate.get('ADMIN.TEST.SAVED').subscribe(msg => {
        this.httpService.openTooltip(msg);
      });
    }
  );
}

onNoClick() {
  this.dialogRef.close(true);
}

getSubjects() {
 this.httpService.getSubjects().subscribe(
  (data) => this.subjects = data);
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
