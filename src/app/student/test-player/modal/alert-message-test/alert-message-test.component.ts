import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-alert-message-test',
  templateUrl: './alert-message-test.component.html',
  styleUrls: ['./alert-message-test.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AlertMessageTestComponent implements OnInit {
  constructor(
    public matDialogRef: MatDialogRef<AlertMessageTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  handleFinish(): void {
    this.matDialogRef.close(true);
  }
}
