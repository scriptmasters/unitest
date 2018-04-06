import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { SubjectService } from './services/subject.service';
import {AddSubjectComponent} from './add-subject/add-subject.component';
import {EditSubjectComponent} from './edit-subject/edit-subject.component';

interface Subjects {
  subject_id: number;
  subject_name: string;
  subject_description: string;
}

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  subjects: Subjects;
  form: FormGroup;

  constructor(
    private subjectService: SubjectService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getSub();
  }

  getSub() {
    this.subjectService.getSubjects()
      .subscribe((data: Subjects) => {
        this.subjects = data;
      });
  }

  openModalAdd() {
    const matDialogRef = this.dialog.open(AddSubjectComponent, {
      width: '600px',
      data: {name: 'test'}
    });

    matDialogRef.afterClosed().subscribe(result => {
      this.getSub();
    });
  }


  openModalEdit(id) {
    const matDialogRef = this.dialog.open(EditSubjectComponent, {
      height: '400px',
      width: '600px',
      data: {subject_id: id, name: 'test'}
    });

    matDialogRef.afterClosed().subscribe(result => {
      this.getSub();
    });
  }

}
