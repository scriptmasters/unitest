import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';

import { StudentsService } from '../students.service';
import { IResponse } from '../students-interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-student-delete-confirm',
  templateUrl: './student-delete-confirm.component.html',
  styleUrls: ['./student-delete-confirm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudentDeleteConfirmComponent implements OnInit {

  constructor(
    private service: StudentsService, 
    public dialogRef: MatDialogRef<StudentDeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  handleDelete():void {
    this.service.deleteStudent(this.data.id).subscribe(
      (data: IResponse) => this.dialogRef.close(data.response),
      error => {
        this.dialogRef.close(error.error.response);
      });
  }

  handleClose():void {
    this.dialogRef.close();
  }
}
