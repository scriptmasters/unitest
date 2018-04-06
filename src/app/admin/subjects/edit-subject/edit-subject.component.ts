import {Component, Inject, OnInit} from '@angular/core';
import {SubjectService} from '../services/subject.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

interface Subject {
  subject_id: number;
  subject_name: string;
  subject_description: string;
}

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.scss']
})
export class EditSubjectComponent implements OnInit {

  subject: Subject;
  form: FormGroup;
  isLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private matDialogRef: MatDialogRef<EditSubjectComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private subjectService: SubjectService
  ) { }

  ngOnInit() {
    this.getSubject();

    this.form = new FormGroup({
      'title': new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      'description': new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ])
    });
  }

  getSubject() {
    const id = this.data.subject_id;
    this.subjectService.getSubjectById(id)
      .subscribe((data) => {
        this.subject = data[0];
        this.isLoaded = true;
      });
  }

  onSubmit() {
    const id = this.data.subject_id;
    const formData = this.form.value;
    this.subjectService.editSubject(id, formData.title, formData.description)
      .subscribe((data: Subject) => {
        if (data) {
          return this.matDialogRef.close();
        }
      });
  }

  closeDialog() {
    this.matDialogRef.close();
  }

}
