import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SpecialityService } from '../speciality.service';
@Component({
  selector: 'app-delete-speciality-form',
  templateUrl: './delete-speciality-form.component.html',
  styleUrls: ['./delete-speciality-form.component.scss']
})
export class DeleteSpecialityFormComponent implements OnInit {

  constructor(
    private speciality: SpecialityService,
    public dialogRef: MatDialogRef<DeleteSpecialityFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any) { }

  ngOnInit() {
  }
  specialityFormDelete() {
    console.log(this.data.id);
    this.speciality.specialitiesObject = this.speciality.specialitiesObject.filter(item => item.speciality_id !== this.data.id);
    this.speciality.delSpecialitiey(this.data.id).subscribe(
      data => this.dialogRef.close(data.response),
      error => {
        this.dialogRef.close(error.error.response);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
