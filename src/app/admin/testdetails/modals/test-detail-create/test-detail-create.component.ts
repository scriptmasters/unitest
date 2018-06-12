import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TestDetailsService} from '../../sevices/test-details.service';
import {ResponseMessageComponent} from '../../../../shared/response-message/response-message.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-test-detail-create',
  templateUrl: './test-detail-create.component.html',
  styleUrls: ['./test-detail-create.component.scss']
})
export class TestDetailCreateComponent implements OnInit {
  levels: number[];
  detailForm: FormGroup;
  correctData;
  existData;
  constructor(public dialogRef: MatDialogRef<TestDetailCreateComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              public testDetailsService: TestDetailsService, private translate: TranslateService) {
                translate.get('ADMIN.TD.D').subscribe(msg => {
                  this.correctData = msg;
                });
                translate.get('ADMIN.TD.EN').subscribe(msg => {
                  this.existData = msg;
                });
  }

  ngOnInit() {
    this.levels = Array.from(Array(20).keys()).map(i => i + 1);
    this.initForm();
  }

  save() {
    if (this.detailForm.valid && this.detailForm.dirty) {
      const isEdit = this.data && this.data.id;
      !(isEdit) ? this.add() : this.edit();
    }
  }

  private add() {
    const rawValues = this.detailForm.getRawValue();
    delete rawValues['id'];
    this.testDetailsService.addNewTestDetail(rawValues).subscribe(() => {
      this.dialogRef.close(true);
    }, err => {

      const errorMessage = (err.error.response.search(/1062 Duplicate entry/) > 0)
        ? this.existData
        : this.correctData;

      this.dialog.open(ResponseMessageComponent, {
        data: {message: errorMessage}
      });
    }, () => {
      this.translate.get('ADMIN.TD.ADDED').subscribe(msg => {
        this.testDetailsService.openTooltip(msg);
      });
    });

  }

  private edit() {
    const rawValues = this.detailForm.getRawValue();
    this.translate.get('ADMIN.TD.D').subscribe(msg => {
      this.testDetailsService.editTestDetail(rawValues).subscribe(() => {
        this.dialogRef.close(true);
      }, () => {
        const errorMessage = msg;
        this.dialog.open(ResponseMessageComponent, {
          data: {message: errorMessage}
        });
      }, () => {
        this.translate.get('ADMIN.TD.EDITED').subscribe(m => {
          this.testDetailsService.openTooltip(m);
        });
      });
    });
  }

  private initForm() {
    this.detailForm = this.formBuilder.group({
      id: (this.data && this.data.id ? this.data.id as string : null),
      test_id: [(this.data && this.data.test_id ? this.data.test_id : null)],
      level: [(this.data && this.data.level ? this.data.level : null),
        [Validators.required]],
      tasks: [(this.data && this.data.tasks ? this.data.tasks : null),
        [Validators.required,
          Validators.min(1),
          Validators.max(250)]],
      rate: [(this.data && this.data.rate ? this.data.rate : null),
        [Validators.required,
          Validators.min(1),
          Validators.max(250)]]
    }, {updateOn: 'blur'});
  }
}
