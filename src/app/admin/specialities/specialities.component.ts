import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpecialityService} from './speciality.service';
import {MatDialog, MatPaginatorIntl, MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PopupFormComponent} from './popup-form/popup-form.component';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {ActivatedRoute, Router} from '@angular/router';
import {IResponse} from './specialityInterface';
import {FormGroup} from '@angular/forms';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {Pagination} from '../../shared/pagination/pagination.class';
import {PaginationService} from '../../shared/pagination/pagination.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-specialities',
    templateUrl: './specialities.component.html',
    styleUrls: ['./specialities.component.scss']
})
export class SpecialitiesComponent extends Pagination implements OnInit, OnDestroy {

    form: FormGroup;

    constructor(private speciality: SpecialityService,
                public router: Router,
                public route: ActivatedRoute,
                public pagIntl: MatPaginatorIntl,
                public http: HttpClient,
                public dialog: MatDialog,
                public pagService: PaginationService,
                public snackBar: MatSnackBar,
                private translate: TranslateService) {
        super(router, route, pagIntl, http, dialog, pagService, snackBar);
        this.pagService.entity = 'speciality';
        this.entities = 'specialities';
        this.pageSize = 5;
    }

    ngOnInit() {
        this.initLogic(false);
    }

    ngOnDestroy() {
        this.destroyLogic();
    }

    getGroups(id): void {
        this.router.navigate(['admin/groups'], {queryParams: {specialityId: id}});
    }

    openModal(id?): void {
        const dialogRef = this.dialog.open(PopupFormComponent, {
            disableClose: true,
            width: '600px',
            data: {speciality_id: id}
        });
        dialogRef.afterClosed().subscribe((response: any) => {
            if (response) {
                if (response.status === 'SUCCESS') {
                    this.openTooltip(response.message);
                    this.getEntity();
                } else if ((response.status === 'ERROR')) {
                    this.dialog.open(ResponseMessageComponent, {
                        width: '400px',
                        data: {
                            message: response.message
                        }
                    });
                }
            }
        });
    }

    delete(id): void {
        this.translate.get('ADMIN.SPEC.DELQ').subscribe(msg => {
            const dialogRef = this.dialog.open(DeleteConfirmComponent, {
                width: '500px',
                data: {message: msg}
            });
            dialogRef.afterClosed().subscribe((Response: boolean) => {
                if (Response) {
                    this.speciality.delSpecialitiey(id).subscribe((data: IResponse) => {
                            if (data.response === 'ok') {
                                this.translate.get('ADMIN.SPEC.DELETED').subscribe(m => {
                                    this.openTooltip('Спеціальність було успішно видалено');
                                });
                                if (this.entitiesObj.length > 1) {
                                    this.getEntity();
                                } else {
                                    this.pagination ? this.paginator.previousPage() : this.entitiesObj = undefined;
                                }
                            }
                        },
                        () => {
                            this.translate.get('ADMIN.SPEC.CANTDEL').subscribe(mgs => {
                                this.dialog.open(ResponseMessageComponent, {
                                    width: '400px',
                                    data: {
                                        message: mgs
                                    }
                                });
                            });
                        });
                }
            });
        });
    }
}

