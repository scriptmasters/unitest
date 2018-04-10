import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FacultiesService} from '../faculties.service';
import { Faculties } from '../facultiesInterface';

@Component({
  selector: 'app-faculties-update',
  templateUrl: './faculties-update.component.html',
  styleUrls: ['./faculties-update.component.scss']
})
export class FacultiesUpdateComponent implements OnInit {
    
    faculties: Faculties[];
    form: FormGroup;

  constructor(private facultiesService: FacultiesService,
    private matDialogRef: MatDialogRef<FacultiesUpdateComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) { }

  

  ngOnInit() {
  	this.getFaculty();

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [ Validators.required,])
    });
  }

  getFaculty(): void {
    const id = this.data.faculty_id;
    this.facultiesService.getFacultyById(id)
      .subscribe((faculties: Faculties[]) => {
        this.faculties = faculties;
      });
  }

  onSubmit() {
    const id = this.data.faculty_id;
    const formData = this.form.value;
    this.facultiesService.editFaculty(id, formData.title, formData.description)
      .subscribe((faculties: Faculties[]) => {
        if (faculties) {
          return this.matDialogRef.close();
        }
       } 
      );
  }

  closeDialog(): void {
    this.matDialogRef.close();
  }

}

