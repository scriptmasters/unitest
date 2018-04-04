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

  constructor(
    private route: ActivatedRoute,
    private matDialogRef: MatDialogRef<EditSubjectComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private subjectService: SubjectService
  ) { }

  ngOnInit() {
    this.getSubject();

    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });
  }

  getSubject() {
    const id = this.data.subject_id;
    this.subjectService.getSubjectById(id)
      .subscribe((data: Subject) => {
        this.subject = data;
      });
  }

  onSubmit() {
    const id = this.data.subject_id;
    const formData = this.form.value;
    this.subjectService.editSubject(id, formData.title, formData.description)
      .subscribe((data: Subject) => {
        if (data) {
          this.matDialogRef.close();
        }
      });
  }

  closeDialog() {
    this.matDialogRef.close();
  }

}
