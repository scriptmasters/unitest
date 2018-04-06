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
  faculty: string = "Вибрати факультет";
  speciality: string = "Вибрати спеціальність";
  group: number;

  facultiesArr = [];
  specialitiesArr = [];

  // facultiesData = [];
  // specialitiesData = [];

  constructor(private groupsService: GroupsService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

 

  dropDownsData(): void {
    this.groupsService._getFaculties().subscribe(facData => {
      this.facultiesArr = facData;
      this.groupsService._getSpecialities().subscribe(specData => {
        this.specialitiesArr = specData;
        
        
        console.log("FACULTY" + this.faculty);
      
      })
    });
  };
 

  public close() {
      this.dialogRef.close({ faculty_id: this.faculty, speciality_id: this.speciality, group_name: this.group, group_id: this.data.group_id });
  }

  ngOnInit() {
    this.dropDownsData();

  }


}
