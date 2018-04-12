import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {SubjectService} from '../services/subject.service';
import {Subject} from '../subject';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent implements OnInit {

  subjects: Subject[];
  form: FormGroup;
  error;

  constructor(
    private subjectService: SubjectService,
    private matDialogRef: MatDialogRef<AddSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        // this.checkSubjectName.bind(this)
      ]),
      'description': new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ])
    });
  }

  onSubmit() {
    const formData = this.form.value;
    this.subjectService.addSubject(formData.title, formData.description)
      .subscribe((subject: Subject[]) => {
        if (subject) {
          return this.matDialogRef.close();
        }
      },
        error => this.error = error
      );
  }

  // checkSubjectName(control: FormControl): Promise<any> {
  //   return new Promise ((resolve, reject) => {
  //     this.subjectService.getSubjectByName(control.value)
  //       .subscribe((subject: Subject[]) => {
  //         if (subject && (subject[0].subject_name === control.value)) {
  //           resolve({sameTitle: true});
  //         } else {
  //           resolve (null);
  //         }
  //       });
  //   });
  // }

  closeDialog(): void {
    this.matDialogRef.close();
  }
}
