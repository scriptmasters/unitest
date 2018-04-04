import { Observable } from 'rxjs/Observable';
import { GroupsService } from './../groups.service';
import { Faculties, Specialities } from './../interface';
import { FormsModule, NgModel } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { Component, OnInit, Inject, group, Input } from '@angular/core';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  faculty: string = "";
  speciality: string = "";
  group: number;
  facultiesArr = [];
  specialitiesArr = [];
  facultiesData = [];
  specialitiesData = [];

  constructor(private groupsService: GroupsService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

 

  mainDialog(): void {
    this.groupsService._getFaculties().subscribe(facData => {
      this.facultiesData = facData;
      this.groupsService._getSpecialities().subscribe(specData => {
        this.specialitiesData = specData;
        console.log("LENGTH = " + this.facultiesData.length);
        for (let i = 0; i < this.facultiesData.length; i++) {
          this.facultiesArr.push(this.facultiesData[i].faculty_name);
        }
        for (let i = 0; i < this.specialitiesData.length; i++) {
          this.specialitiesArr.push(this.specialitiesData[i].speciality_name);
        }

        this.faculty = this.facultiesArr[0];
        this.speciality = this.specialitiesArr[0];
      
      })
    });
  };
 

  public close() {
      this.dialogRef.close({ faculty: this.faculty, speciality: this.speciality, group: this.group });
  }

  ngOnInit() {
    this.mainDialog();

  }


}
