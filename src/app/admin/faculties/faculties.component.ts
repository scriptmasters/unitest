import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacultiesService} from './services/faculties.service';
import {MatDialog, MatPaginatorIntl, MatSnackBar} from '@angular/material';
import {Faculties, IResponse} from './facultiesInterface';
import {FacultiesDialogComponent} from './faculties-dialog/faculties-dialog.component';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {FormGroup} from '@angular/forms';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Pagination} from '../../shared/pagination/pagination.class';
import {HttpClient} from '@angular/common/http';
import {PaginationService} from '../../shared/pagination/pagination.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-faculties',
    templateUrl: './faculties.component.html',
    styleUrls: ['./faculties.component.scss']
})

export class FacultiesComponent extends Pagination implements OnInit, OnDestroy {
    faculties: Faculties[];
    form: FormGroup;
    error: string;
    constructor(private facultiesService: FacultiesService,
                public router: Router,
                public route: ActivatedRoute,
                public pagIntl: MatPaginatorIntl,
                public http: HttpClient,
                public dialog: MatDialog,
                public pagService: PaginationService,
                public snackBar: MatSnackBar, private translate: TranslateService) {
                    super(router, route, pagIntl, http, dialog, pagService, snackBar);
    }

    ngOnInit() {
        this.faculties = this.route.snapshot.data['faculties'];
        this.initLogic(true);
    }

    ngOnDestroy() {
        this.destroyLogic();
    }


    getAllFaculties(): void {
        this.facultiesService.getFaculties()
            .subscribe((data: Faculties[]) => {
                this.faculties = data;
            });
    }

    getGroups(id): void {
        this.router.navigate(['admin/groups'], {queryParams: {facultyId: id}});
    }

    getFoundFaculties(event) {
        this.facultiesService.getFoundFaculties(event.target.value).subscribe(
            (data: any) => {
                this.pagService.pagSubscr.next(false);
                if (data.response === 'no records') {
                    this.faculties = undefined;
                    this.error = 'За даним пошуковим запитом дані відсутні';
                } else {
                    this.faculties = data;
                }
            }, () => {
                this.faculties = undefined;
                this.pagService.pagSubscr.next(false);
            }
        );
    }

// Add and update operations
    openDialog(id?): void {
        const matDialogRef = this.dialog.open(FacultiesDialogComponent, {
            width: '500px',
            data: {faculty_id: id}
        });
        matDialogRef.afterClosed().subscribe((response: any) => {
            if (response) {
                if (response.status === 'SUCCESS') {
                    this.openTooltip(response.message);
                    this.getAllFaculties();
                } else if (response.status === 'ERROR') {
                    this.dialog.open(ResponseMessageComponent, {
                        width: '400px',
                        data: {
                            message: response.message
                        }
                    });
                }
            }
        });
        matDialogRef.disableClose = true;
    }

// Delete operation
    deleteFaculty(id): void {
        this.translate.get('ADMIN.FACULTY.QDEL').subscribe(res => {
        const dialogRef = this.dialog.open(DeleteConfirmComponent, {
            width: '500px',
            data: {message: res}
        });
        dialogRef.afterClosed().subscribe((Response: boolean) => {
            if (Response) {
                this.facultiesService.delFaculties(id).subscribe((data: IResponse) => {
                        if (data.response === 'ok') {
                            this.translate.get('ADMIN.FACULTY.REMOVED').subscribe(msg => {
                                this.openTooltip(msg);
                            });
                            this.getAllFaculties();
                            if (this.pagService.paginatedLength === 1) {
                                this.paginator.previousPage();
                            }
                        }
                    },
                    () => {
                        this.translate.get('ADMIN.FACULTY.NOTDEL').subscribe(msg => {
                            this.dialog.open(ResponseMessageComponent, {
                            width: '400px',
                            data: {
                                message: msg
                            }
                        });
                    });
                });
            }
        });
        dialogRef.disableClose = true;
    });
    }
}
