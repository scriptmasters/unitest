import {Component, Inject, OnInit} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-timetable-delete-confirm',
  templateUrl: './timetable-delete-confirm.component.html',
  styleUrls: ['./timetable-delete-confirm.component.scss']
})
export class TimetableDeleteConfirmComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TimetableDeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  handleDelete(): void {
    this.dialogRef.close('ok');
  }

  handleClose(): void {
    this.dialogRef.close();
  }
}
