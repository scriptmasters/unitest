import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { FacultiesService } from '../faculties.service';
import { Faculties } from '../facultiesInterface';

@Component({
  selector: 'app-faculties-add',
  templateUrl: './faculties-add.component.html',
  styleUrls: ['./faculties-add.component.scss']
})
export class FacultiesAddComponent implements OnInit {

	  faculties: Faculties;
    form: FormGroup;

  constructor(private facultiesService: FacultiesService,
    private matDialogRef: MatDialogRef<FacultiesAddComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) { }

     ngOnInit() {

        this.form = new FormGroup({
         'title': new FormControl(null, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)]),
         'description': new FormControl(null, [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100)])
        });
     };

 closeDialog() {
     this.matDialogRef.close();
    }

  onSubmit() {
    const formData = this.form.value;
    this.facultiesService.addFaculty(formData.title, formData.description)
      .subscribe((faculty: Faculties) => {
        if (faculty) { 
          this.matDialogRef.close();
        }
      });
  }
}