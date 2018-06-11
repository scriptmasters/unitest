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
import { TranslateService } from '@ngx-translate/core';

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
                public snackBar: MatSnackBar,
                private translate: TranslateService) {
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
        this.translate.get('ADMIN.SUBJ.QDEL').subscribe(msg => {
        const matDialogRef = this.dialog.open(DeleteConfirmComponent, {
            disableClose: true,
            width: '400px',
            data: {
                message: msg,
            },
        });
        matDialogRef.afterClosed().subscribe((response: boolean) => {
            if (response) {
                this.subjectService.deleteSubject(id).subscribe(
                    (data: any) => {
                        if (data.response === 'ok') {
                            this.translate.get('ADMIN.SUBJ.SDEL').subscribe(m => {
                                this.openTooltip(m);
                            });
                            if (this.entitiesObj.length > 1) {
                                this.getEntity();
                            } else {
                                this.pagination ? this.paginator.previousPage() : this.entitiesObj = undefined;
                            }
                        }
                    },
                    () => {
                        this.translate.get('ADMIN.SUBJ.DELLER').subscribe(result => {
                            this.dialog.open(ResponseMessageComponent, {
                                disableClose: true,
                                width: '400px',
                                data: {
                                    message: result,
                                },
                            });
                        });

                    }
                );
            }
        });
    });
    }
}
