import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

import { SubjectService } from './services/subject.service';
import { Subject } from './subject';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { ModalSubjectComponent } from './modal-subject/modal-subject.component';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[];
  form: FormGroup;
  error: string;
  searchBox = new FormControl();
  searchBoxSubscr: Subscription;

  config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  constructor(
    private subjectService: SubjectService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.getSubjects();
    this.searchBoxSubscr = this.searchBox.valueChanges
        .debounceTime(1000)
        .subscribe(newValue => {
            this.subjectService.getSearchedSubjects(newValue)
                .subscribe(
                (data: any) => {
                    if (data.response === 'no records') {
                        this.subjects = undefined;
                        this.error = 'За даним пошуковим запитом дані відсутні';
                    } else {
                        this.subjects = data;
                    }
                }
            );
        });
  }

  getSubjects(): void {
    this.subjectService.getSubjects().subscribe((subjects: Subject[]) => {
      this.subjects = subjects;
    });
  }

  getTimetable(id: number): void {
    this.router.navigate(['admin/timetable'], {
      queryParams: { subjectId: id },
    });
  }

  getTests(id: number): void {
    this.router.navigate(['admin/subjects/tests'], { queryParams: { subjectId: id } });
  }

  openModal(id?: number): void {
    const matDialogRef = this.dialog.open(ModalSubjectComponent, {
      disableClose: true,
      width: '600px',
      data: { subject_id: id },
    });

    matDialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        if (response.status === 'SUCCESS') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: response.message,
            },
          });
          this.getSubjects();
        } else if (response.status === 'ERROR') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: response.message,
            },
          });
        }
      }
    });
  }

  deleteSubject(id: number): void {
    const matDialogRef = this.dialog.open(DeleteConfirmComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Ви справді бажаєте видалити даний предмет?',
      },
    });
    matDialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.subjectService.deleteSubject(id).subscribe(
          (data: any) => {
            if (data.response === 'ok') {
              this.dialog.open(ResponseMessageComponent, {
                disableClose: true,
                width: '400px',
                data: {
                  message: 'Даний предмет успішно видалено!',
                },
              });
              this.getSubjects();
            }
          },
          () => {
            this.dialog.open(ResponseMessageComponent, {
              disableClose: true,
              width: '400px',
              data: {
                message: 'Виникла помилка при видаленні предмета!',
              },
            });
          }
        );
      }
    });
  }
}
