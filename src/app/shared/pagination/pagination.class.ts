import {Subscription} from 'rxjs/Subscription';
import {FormControl} from '@angular/forms';
import {MatDialog, MatPaginator, MatPaginatorIntl} from '@angular/material';
import {ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ResponseMessageComponent} from '../response-message/response-message.component';
import {HttpClient} from '@angular/common/http';

export class Pagination {
    error = 'За даним пошуковим запитом дані відсутні';
    searchBox = new FormControl();
    searchBoxSubscr: Subscription;
    length: number;
    pageSize = 5;
    pageIndex: number;
    pagination: boolean;
    entitiesObj: any;
    entity: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public router: Router,
                public route: ActivatedRoute,
                public pagIntl: MatPaginatorIntl,
                public http: HttpClient,
                public dialog: MatDialog) {
    }

    pagService = {
        getSearchedEntities: (searchString) => {
            return this.http.get( `${this.entity}/getRecordsBySearch/${searchString}`);
        },
        countEntities: () => {
            return this.http.get(`${this.entity}/countRecords`);
        },
        getEntitiesRange: (limit, offset) => {
            return this.http.get(`${this.entity}/getRecordsRange/${limit}/${offset}`);
        }
    };

    initLogic() {
        this.pagIntl.firstPageLabel = 'Перша сторінка';
        this.pagIntl.lastPageLabel = 'Остання сторінка';
        this.pagIntl.nextPageLabel = 'Наступна сторінка';
        this.pagIntl.previousPageLabel = 'Попередня сторінка';
        this.pagIntl.itemsPerPageLabel = 'Кількість елементів';

        this.route.queryParams.subscribe(params => {
            params.page ? this.pageIndex = +params.page - 1 : this.pageIndex = 0;


            this.getEntity();
        });

        this.searchBoxSubscr = this.searchBox.valueChanges
            .debounceTime(1000)
            .subscribe(newValue => {
                if (newValue !== '') {
                    this.pagination = false;
                    this.pagService.getSearchedEntities(newValue)
                        .subscribe(
                            (data: any) => {
                                if (data.response === 'no records') {
                                    this.entitiesObj = undefined;
                                } else {
                                    this.entitiesObj = data;
                                }
                            }
                        );
                } else {
                    this.getEntity();
                }
            });
    }

    getEntity(event?): void {
        this.pagination = true;
        if (event) {
            this.pageIndex = event.pageIndex;
            this.pageSize = event.pageSize;
            this.router.navigate([`admin/${this.entity}s`], {queryParams: {page: this.pageIndex + 1}});
        } else {
            this.pagService.countEntities().subscribe((data: any) =>
                this.length = +data.numberOfRecords);

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

}
