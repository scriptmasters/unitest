import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { TestService } from '../test.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseMessageComponent } from '../../../shared/response-message/response-message.component';
import { forbiddenCharValidator } from '../tests-validator.directive';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  rForm: FormGroup;
  subjects;
  s_id;
  en;
  dis;
  enabled;
  constructor(public dialogRef: MatDialogRef<AddComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
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
    this.enabled = [{ value: 1, text: this.en }, { value: 0, text: this.dis }];
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
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    this.httpService.addTest(this.rForm.value).subscribe(
      () => {
        this.dialogRef.close();
        this.translate.get('ADMIN.TEST.ADDED').subscribe((res: string) => {
          this.httpService.openTooltip(res);
        }
        );
      },
      (err) => {
        this.dialogRef.close();
        this.translate.get('ADMIN.TEST.NEXIST').subscribe(msg => {
          this.dialog.open(ResponseMessageComponent, {
            width: '350px',
            data: {
              message: msg
            }
          });
        });
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

