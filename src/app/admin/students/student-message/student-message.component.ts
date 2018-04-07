import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';

import { StudentsService } from '../students.service';
import { IResponse } from '../students-interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-student-message',
  templateUrl: './student-message.component.html',
  styleUrls: ['./student-message.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudentMessageComponent implements OnInit {

  constructor(
    private service: StudentsService, 
    public dialogRef: MatDialogRef<StudentMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  handleClose():void {
    this.dialogRef.close();
  }

}
