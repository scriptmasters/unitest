import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {TestDetailsService} from '../../sevices/test-details.service';
import {ResponseMessageComponent} from '../../../../shared/response-message/response-message.component';

@Component({
  selector: 'app-test-detail-create',
  templateUrl: './test-detail-create.component.html',
  styleUrls: ['./test-detail-create.component.scss']
})
export class TestDetailCreateComponent implements OnInit {
  levels: number[];
  detailForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<TestDetailCreateComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              public testDetailsService: TestDetailsService) {
  }

  ngOnInit() {
    // this.levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
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
        ? 'Дані цього рівня уже існують'
        : 'Введіть коректні дані';

      this.dialog.open(ResponseMessageComponent, {
        data: {message: errorMessage}
      });
    }, () => {
      const matDialogRef = this.dialog.open(ResponseMessageComponent, {
        width: '350px',
        data: {message: 'Деталі тесту успішно додано'}
      });
    });

  }

  private edit() {
    const rawValues = this.detailForm.getRawValue();
    this.testDetailsService.editTestDetail(rawValues).subscribe(() => {
      this.dialogRef.close(true);
    }, err => {
      const errorMessage = 'Введіть коректні дані';
      this.dialog.open(ResponseMessageComponent, {
        data: {message: errorMessage}
      });
    }, () => {
      const matDialogRef = this.dialog.open(ResponseMessageComponent, {
        width: '350px',
        data: {message: 'Деталі тесту успішно змінені'}
      });
    })
  }

  private initForm() {
    this.detailForm = this.formBuilder.group({
      id: (this.data && this.data.id ? this.data.id : null),
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
