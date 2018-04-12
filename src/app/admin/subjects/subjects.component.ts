import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {OnDestroy} from '@angular/core';
import {ISubscription} from 'rxjs/Subscription';

import {SubjectService} from './services/subject.service';
import {AddSubjectComponent} from './add-subject/add-subject.component';
import {EditSubjectComponent} from './edit-subject/edit-subject.component';
import {Subject} from './subject';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit, OnDestroy {

  private subscription: ISubscription;
  subjects: Subject[];
  form: FormGroup;

  constructor(
    private subjectService: SubjectService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.showSubjects();
  }

  showSubjects(): void {
    this.subscription = this.subjectService.getSubjects()
      .subscribe((subjects: Subject[]) => {
        this.subjects = subjects;
      });
  }

  openModalAdd(): void {
    const matDialogRef = this.dialog.open(AddSubjectComponent, {
      width: '600px'
    });

    matDialogRef.afterClosed().subscribe(() => {
      this.showSubjects();
    });
  }


  openModalEdit(id): void {
    const matDialogRef = this.dialog.open(EditSubjectComponent, {
      width: '600px',
      data: {subject_id: id}
    });

    matDialogRef.afterClosed().subscribe( () => {
      this.showSubjects();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
