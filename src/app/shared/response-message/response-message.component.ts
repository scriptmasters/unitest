import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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

  handleClose():void {
    this.dialogRef.close();
  }
}
