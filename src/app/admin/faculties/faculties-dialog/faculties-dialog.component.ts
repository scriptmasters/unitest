import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FacultiesService} from '../services/faculties.service';
import {Faculties} from '../facultiesInterface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faculties-dialog',
  templateUrl: './faculties-dialog.component.html',
  styleUrls: ['./faculties-dialog.component.scss']
 })
export class FacultiesDialogComponent implements OnInit {

  faculty = [{faculty_name: '', faculty_description: ''}];
  form: FormGroup;
  isLoaded = true;
  edited;
  nchange;
  constructor(
    private matDialogRef: MatDialogRef<FacultiesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private facultiesService: FacultiesService, private translate: TranslateService
  ) {
    translate.get('ADMIN.FACULTY.EDITS').subscribe(msg => {
      this.edited = msg;
    });
    translate.get('ADMIN.TEST.NCHANGES').subscribe(msg => {
      this.nchange = msg;
    });
  }

  ngOnInit() {
    this.getFaculty();

    this.form = new FormGroup({
      'title': new FormControl(null, [
        Validators.required,
        Validators.pattern('([А-ЯІЇа-яії]{4,})([ А-ЯІЇа-яії ])+'),
        Validators.maxLength(50)
      ]),
      'description': new FormControl(null, [
        Validators.required,
        Validators.pattern('([А-ЯІЇа-яії])([ А-ЯІЇа-яії ])+'),
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
            this.matDialogRef.close({status: 'SUCCESS', message: this.edited}),
          () => this.matDialogRef.close({status: 'ERROR', message: this.nchange})
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
