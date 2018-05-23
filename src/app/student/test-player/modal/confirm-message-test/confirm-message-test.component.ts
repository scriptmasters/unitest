import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-confirm-message-test',
  templateUrl: './confirm-message-test.component.html',
  styleUrls: ['./confirm-message-test.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmMessageTestComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<ConfirmMessageTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  handleFinish(): void {
    this.matDialogRef.close(true);
  }

  handleClose(): void {
    this.matDialogRef.close();
  }
}
