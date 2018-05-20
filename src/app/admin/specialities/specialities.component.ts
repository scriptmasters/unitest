import {Component, OnInit} from '@angular/core';
import {SpecialityService} from './speciality.service';
import {MatDialog, MatPaginatorIntl} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {PopupFormComponent} from './popup-form/popup-form.component';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {ActivatedRoute, Router} from '@angular/router';
import {IResponse} from './specialityInterface';
import {FormGroup} from '@angular/forms';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {Pagination} from '../../shared/pagination/pagination.class';
import {PaginationService} from '../../shared/pagination/pagination.service';


@Component({
    selector: 'app-specialities',
    templateUrl: './specialities.component.html',
    styleUrls: ['./specialities.component.scss']
})
export class SpecialitiesComponent extends Pagination implements OnInit {

    form: FormGroup;

    constructor(private speciality: SpecialityService,
                public router: Router,
                public route: ActivatedRoute,
                public pagIntl: MatPaginatorIntl,
                public http: HttpClient,
                public dialog: MatDialog,
                public pagService: PaginationService) {
        super(router, route, pagIntl, http, dialog, pagService);
        this.pagService.entity = 'speciality';
        this.entities = 'specialities';
        this.pageSize = 5;
    }

    ngOnInit() {
        this.initLogic(false);
    }

    getGroups(id): void {
        this.router.navigate(['admin/groups'], {queryParams: {specialityId: id}});
    }

    openModal(id): void {
        const dialogRef = this.dialog.open(PopupFormComponent, {
            disableClose: true,
            width: '600px',
            data: {speciality_id: id}
        });
        dialogRef.afterClosed().subscribe((response: any) => {
            if (response) {
                if (response.status === 'SUCCESS') {
                    this.dialog.open(ResponseMessageComponent, {
                        width: '400px',
                        data: {
                            message: response.message
                        }
                    });
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
        const dialogRef = this.dialog.open(DeleteConfirmComponent, {
            width: '500px',
            data: {message: 'Ви справді бажаєте видалити дану спеціальность?'}
        });
        dialogRef.afterClosed().subscribe((Response: boolean) => {
            if (Response) {
                this.speciality.delSpecialitiey(id).subscribe((data: IResponse) => {
                        if (data.response === 'ok') {
                            this.dialog.open(ResponseMessageComponent, {
                                width: '400px',
                                data: {
                                    message: 'Спеціальность було успішно видалено!'
                                }
                            });
                            if (this.entitiesObj.length > 1) {
                                this.getEntity();
                            } else {
                                this.pagination ? this.paginator.previousPage() : this.entitiesObj = undefined;
                            }
                        }
                    },
                    () => {
                        this.dialog.open(ResponseMessageComponent, {
                            width: '400px',
                            data: {
                                message: 'Неможливо видалити даний спеціальность, тому що він не є порожнім!'
                            }
                        });
                    });
            }
        });
    }
}

