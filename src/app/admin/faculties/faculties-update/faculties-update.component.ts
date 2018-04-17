import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FacultiesService} from '../faculties.service';
import {Faculties} from '../facultiesInterface';

@Component({
  selector: 'app-faculties-update',
  templateUrl: './faculties-update.component.html',
  styleUrls: ['./faculties-update.component.scss']
 })
export class FacultiesUpdateComponent implements OnInit {

  faculty: Faculties[];
  form: FormGroup;
  isLoaded = false;
  constructor(
    private matDialogRef: MatDialogRef<FacultiesUpdateComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private facultiesService: FacultiesService
  ) { }

  ngOnInit() {
    this.getFaculty();

    this.form = new FormGroup({
      'title': new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ]),
      'description': new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ])
    });
  }

  getFaculty(): void {
    const id = this.data.faculty_id;
    this.facultiesService.getFacultyById(id)
      .subscribe((faculty: Faculties[]) => {
        this.faculty = faculty;
        this.isLoaded = true;
      });
  }

  onSubmit() {
    const id = this.data.faculty_id;
    const formData = this.form.value;
    this.facultiesService.editFaculty(id, formData.title, formData.description)
      .subscribe((faculty: Faculties[]) => {
         if (faculty) {
           return this.matDialogRef.close();
         }
      });
  }

  closeDialog(): void {
    this.matDialogRef.close();
  }
}
