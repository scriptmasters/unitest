import {Subscription} from 'rxjs/Subscription';
import {FormControl} from '@angular/forms';
import {MatDialog, MatPaginator, MatPaginatorIntl} from '@angular/material';
import {ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ResponseMessageComponent} from '../response-message/response-message.component';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/debounceTime';
import {PaginationService} from './pagination.service';
import 'rxjs/add/operator/delay';



export class Pagination {
    error = 'За даним пошуковим запитом дані відсутні';
    searchBox = new FormControl();
    searchBoxSubscr: Subscription;
    pageSize = 10;
    pageIndex = 0;
    entitiesObj: any;
    entities: string;
    pagination: boolean;
    progress: boolean;
    emptyCollection: boolean;
    mainSubscription: Subscription;
    pagSubscription: Subscription;
    progressbarSubscription: Subscription;
    routeSuscription: Subscription;
    emptyCollectionSubscription: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public router: Router,
                public route: ActivatedRoute,
                public pagIntl: MatPaginatorIntl,
                public http: HttpClient,
                public dialog: MatDialog,
                public pagService: PaginationService) {
    }

    initLogic(dontGetEntity) {
        this.pagIntl.firstPageLabel = 'Перша сторінка';
        this.pagIntl.lastPageLabel = 'Остання сторінка';
        this.pagIntl.nextPageLabel = 'Наступна сторінка';
        this.pagIntl.previousPageLabel = 'Попередня сторінка';
        this.pagIntl.itemsPerPageLabel = 'Кількість елементів';
        this.pagService.pagSubscr.next(true);

        this.pagSubscription = this.pagService.pagSubscr.delay(0).subscribe(
            data => {
                this.pagination = data;
            }
        );

        this.progressbarSubscription = this.pagService.progressbar.delay(0).subscribe(
            data => {
                data === 0 ? this.progress = false : this.progress = true;
            }
        );

        this.routeSuscription = this.route.queryParams.subscribe(params => {
            params.page ? this.pageIndex = +params.page - 1 : this.pageIndex = 0;
            dontGetEntity ? this.pagService.pagSubscr.next(true) : this.getEntity();
        });

        this.emptyCollectionSubscription = this.pagService.emptySubscr.delay(0).subscribe(
            data => {
                data ? this.emptyCollection = true : this.emptyCollection = false;
            }
        );

        this.searchBoxSubscr = this.searchBox.valueChanges
            .debounceTime(600)
            .subscribe(newValue => {
                if (newValue !== '') {
                    this.pagService.getSearchedEntities(newValue)
                        .subscribe(
                            (data: any) => {
                                this.pagService.pagSubscr.next(false);
                                if (data.response === 'no records') {
                                    this.entitiesObj = undefined;
                                } else {
                                    this.entitiesObj = data;
                                    this.pageIndex = 0;
                                }
                            }, () => {
                                this.pagService.pagSubscr.next(false);
                                this.entitiesObj = undefined;
                            }
                        );
                } else {
                    dontGetEntity ? this.pagService.pagSubscr.next(true) : this.getEntity();
                }
            });

        /*this.mainSubscription = this.pagSubscription
            .add(this.progressbarSubscription)
            .add(this.searchBoxSubscr)
            .add(this.emptyCollectionSubscription);*/
    }

    destroyLogic() {
        this.mainSubscription.unsubscribe();
    }

    getEntity?(event?): void {
        this.pagService.pagSubscr.next(true);
        if (event) {
            this.pageSize = event.pageSize;
            event.pageIndex === this.pageIndex ? this.getEntity() : this.pageIndex = event.pageIndex;
            this.router.navigate([`admin/${this.entities}`], {queryParams: {page: this.pageIndex + 1}});
        } else {
            this.pagService.countEntities().subscribe((data: any) =>
                this.pagService.fullLength = +data.numberOfRecords);

            this.pagService.getEntitiesRange(this.pageSize, this.pageSize * this.pageIndex).subscribe((entities: any) => {
                if (entities.response) {
                    this.paginator.firstPage();
                    this.dialog.open(ResponseMessageComponent, {
                        width: '400px',
                        data: {
                            message: 'Сторінка відсутня, скеровано на початкову'
                        },
                    });
                } else {
                    this.entitiesObj = entities;
                }
            });
        }
    }

    paginationChange? (event) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
    }
}

