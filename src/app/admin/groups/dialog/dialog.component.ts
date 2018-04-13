import { Observable } from 'rxjs/Observable';
import { GroupsService } from './../groups.service';
import { Faculties, Specialities } from './../interface';
import { FormsModule, NgModel, FormGroup, FormControl, Validators } from '@angular/forms';
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
  group: string = "";

  facultiesArr = [];
  specialitiesArr = [];

  constructor(private groupsService: GroupsService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  dropDownsData(): void {
    this.groupsService._getFaculties().subscribe(facData => {
      this.facultiesArr = facData;
      this.groupsService._getSpecialities().subscribe(specData => {
        this.specialitiesArr = specData;

        this.group = this.data.group;
      })
    });
   
  };

  public close() {
      this.dialogRef.close({ faculty: this.faculty, speciality: this.speciality, group_name: this.group, group_id: this.data.group_id });
  }

  handleClose(){
    this.dialogRef.close();
  }
  
  myForm: FormGroup;
  facultyValid: FormControl;
  specialityValid: FormControl;
  groupValid: FormControl;
  
  createFormControls() {
    this.facultyValid = new FormControl('', Validators.required),
    this.specialityValid = new FormControl('', Validators.required),
    this.groupValid = new FormControl('', [
      Validators.required,
      Validators.pattern('^([А-ЯІЇ]){2,3}-[0-9]{2}-[0-9]{1}'),
    ]); 
  }

  createForm() {
    this.myForm = new FormGroup({
      facultyValid: this.facultyValid,
      specialityValid: this.specialityValid,
      groupValid: this.groupValid,
    });
  }
  resetModal(){
    this.group = "";
  }

 

  ngOnInit() {
    this.dropDownsData();
    this.createFormControls();
    this.createForm();

  }


}
