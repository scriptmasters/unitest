import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FacultiesService} from '../faculties.service';
import {Faculties} from '../facultiesInterface';

@Component({
  selector: 'app-faculties-dialog',
  templateUrl: './faculties-dialog.component.html',
  styleUrls: ['./faculties-dialog.component.scss']
 })
export class FacultiesDialogComponent implements OnInit {

  faculty = [{faculty_name: '', faculty_description: ''}];
  form: FormGroup;
  isLoaded = true;
  constructor(
    private matDialogRef: MatDialogRef<FacultiesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
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
    }, { updateOn: 'blur' });
  }

  getFaculty(): void {
    if (this.data.faculty_id) {
      this.isLoaded = false;
      const id = this.data.faculty_id;
      this.facultiesService.getFacultyById(id)
      .subscribe((faculty: Faculties[]) => {
        this.faculty = faculty;
        this.isLoaded = true;
      });
    }
  }

  onSubmit() {
    const formData = this.form.value;

    if (this.data.faculty_id) {
      const id = this.data.faculty_id;
      this.facultiesService.updateFaculty(id, formData.title, formData.description)
        .subscribe(() =>
            this.matDialogRef.close({status: 'SUCCESS', message: 'Факультет було успішно відредаговано!'}),
          () => this.matDialogRef.close({status: 'ERROR', message: 'Ви не внесли ніяких змін при редагуванні!'})
        );
    } else {
      this.facultiesService.addFaculty(formData.title, formData.description)
        .subscribe(() =>
            this.matDialogRef.close({status: 'SUCCESS', message: 'Факультет було успішно додано!'}),
          () => this.matDialogRef.close({status: 'ERROR', message: 'Факультету з такою назвою вже існує!'})
        );
    }
  }

  closeDialog(): void {
    this.matDialogRef.close();
  }
}
