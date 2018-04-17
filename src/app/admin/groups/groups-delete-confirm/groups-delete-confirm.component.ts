import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-groups-delete-confirm',
  templateUrl: './groups-delete-confirm.component.html',
  styleUrls: ['./groups-delete-confirm.component.scss']
})
export class GroupsDeleteConfirmComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<GroupsDeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }


  public delete() {
    this.dialogRef.close(true);
  }
  public cancel() {
    this.dialogRef.close(false);
  }

}
