import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { TestDetailsService } from '../../sevices/test-details.service';

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
              public testDetailsService: TestDetailsService) { }

  ngOnInit() {
    this.levels = Array.from(Array(20).keys()).map(i => i + 1);
    this.initForm();
  }

  save() {
    if (this.detailForm.valid) {
      const isEdit = this.data && this.data.id;
      if (isEdit) {
        this.edit();
      } else {
        this.add();
      }
    }
  }

  private add() {
    const rawValues = this.detailForm.getRawValue();
    delete rawValues['id'];
    this.testDetailsService.addNewTestDetail(rawValues).subscribe(response => {
      this.dialogRef.close(true);
    }, err => {
      alert(err.error.response);
    });
  }

  private edit() {
    const rawValues = this.detailForm.getRawValue();
    this.testDetailsService.editTestDetail(rawValues).subscribe(response => {
      this.dialogRef.close(true);
    }, err => {
      alert(err.error.response);
    });
  }

  private initForm() {
    this.detailForm = this.formBuilder.group({
      id: (this.data && this.data.id ? this.data.id : null),
      test_id: [(this.data && this.data.test_id ? this.data.test_id : null)],
      level: [(this.data && this.data.level ? this.data.level : null), [Validators.required]],
      tasks: [(this.data && this.data.tasks ? this.data.tasks : null), [Validators.required,
                  Validators.min(1),
                  Validators.max(250)]],
      rate: [(this.data && this.data.rate ? this.data.rate : null), [Validators.required,
                  Validators.min(1),
                  Validators.max(250)]]
    });
  }
}
