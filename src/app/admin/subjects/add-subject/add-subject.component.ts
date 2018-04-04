import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SubjectService} from '../services/subject.service';

interface Subjects {
  subject_id: number;
  subject_name: string;
  subject_description: string;
}

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent implements OnInit {

  subjects: Subjects;
  form: FormGroup;

  constructor(
    private subjectService: SubjectService,
    private matDialogRef: MatDialogRef<AddSubjectComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.subjectService.getSubjects()
      .subscribe((data: Subjects) => {
        this.subjects = data;
      });

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  onSubmit() {
    const formData = this.form.value;
    this.subjectService.addSubject(formData.title, formData.description)
      .subscribe((subject: Subjects) => {
        if (subject) {
          console.log(subject);
          this.matDialogRef.close();
        }
      });
  }
}
