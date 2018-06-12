import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatPaginatorIntl, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from './services/subject.service';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {ModalSubjectComponent} from './modal-subject/modal-subject.component';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {Pagination} from '../../shared/pagination/pagination.class';
import {HttpClient} from '@angular/common/http';
import {PaginationService} from '../../shared/pagination/pagination.service';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.scss'],
})

export class SubjectsComponent extends Pagination implements OnInit, OnDestroy {
    form: FormGroup;

    constructor(private subjectService: SubjectService,
                public dialog: MatDialog,
                public router: Router,
                public route: ActivatedRoute,
                public pagIntl: MatPaginatorIntl,
                public http: HttpClient,
                public pagService: PaginationService,
                public snackBar: MatSnackBar) {
        super(router, route, pagIntl, http, dialog, pagService, snackBar);
        this.pagService.entity = 'subject';
        this.entities = 'subjects';
    }

    ngOnInit() {
        this.initLogic(false);
    }

    ngOnDestroy () {
        this.destroyLogic();
    }

    getTimetable(id: number): void {
        this.router.navigate(['admin/timetable'], {
            queryParams: {subjectId: id},
        });
    }

  getTests(id: number): void {
    this.router.navigate(['admin/subjects/tests'], { queryParams: { subjectId: id } });
  }

    openModal(id?: number): void {
        const matDialogRef = this.dialog.open(ModalSubjectComponent, {
            disableClose: true,
            width: '600px',
            data: {subject_id: id},
        });

        matDialogRef.afterClosed().subscribe((response: any) => {
            if (response) {
                if (response.status === 'SUCCESS') {
                    this.openTooltip(response.message);
                    this.getEntity();
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
                            this.openTooltip('Даний предмет успішно видалено');
                            if (this.entitiesObj.length > 1) {
                                this.getEntity();
                            } else {
                                this.pagination ? this.paginator.previousPage() : this.entitiesObj = undefined;
                            }
                        }
                    },
                    () => {
                        this.dialog.open(ResponseMessageComponent, {
                            disableClose: true,
                            width: '400px',
                            data: {
                                message: 'Неможливо видалити даний предмет, тому що він не є порожнім!',
                            },
                        });
                    }
                );
            }
        });
    }
}
