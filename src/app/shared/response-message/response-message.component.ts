import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-response-message',
  templateUrl: './response-message.component.html',
  styleUrls: ['./response-message.component.scss']
})
export class ResponseMessageComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ResponseMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  handleClose(): void {
    this.dialogRef.close();
  }
}
