import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteConfirmComponent implements OnInit {

  constructor( 
    public dialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  handleDelete():void {
    this.dialogRef.close(true);
  }

  handleClose():void {
    this.dialogRef.close();
  }

}
