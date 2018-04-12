import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';

import {SubjectService} from './services/subject.service';
import {AddSubjectComponent} from './add-subject/add-subject.component';
import {EditSubjectComponent} from './edit-subject/edit-subject.component';
import {Subject} from './subject';
import {PaginationInstance} from 'ngx-pagination';
import {Router} from '@angular/router';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  subjects: Subject[];
  form: FormGroup;

  public config: PaginationInstance = {
    itemsPerPage: 3,
    currentPage: 1
  };

  constructor(
    private subjectService: SubjectService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.getSubjects();
  }

  getSubjects(): void {
    this.subjectService.getSubjects()
      .subscribe((subjects: Subject[]) => {
        this.subjects = subjects;
      });
  }

  getTimetable(id): void {
    console.log(id);
    this.router.navigate(['timetable'], { queryParams: { subjectId: id} });
  }

  openModalAdd(): void {
    const matDialogRef = this.dialog.open(AddSubjectComponent, {
      width: '600px'
    });

    matDialogRef.afterClosed().subscribe(() => {
      this.getSubjects();
    });
  }

  openModalEdit(id): void {
    const matDialogRef = this.dialog.open(EditSubjectComponent, {
      width: '600px',
      data: {subject_id: id}
    });

    matDialogRef.afterClosed().subscribe( () => {
      this.getSubjects();
    });
  }
  
  subjectId(id: any) {
    this.router.navigate(['/admin/tests'], {
      queryParams: {id: id}
    });
  }

}
