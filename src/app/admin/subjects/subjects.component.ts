import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import {SubjectService} from './services/subject.service';
import {Subject} from './subject';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {ModalSubjectComponent} from './modal-subject/modal-subject.component';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {MatPaginator, MatPaginatorIntl} from '@angular/material';

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
    length: number;
    pageSize = 5;
    pageIndex: number;
    pagination: boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private subjectService: SubjectService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                private pagIntl: MatPaginatorIntl) {
    }

    ngOnInit() {
        this.pagIntl.firstPageLabel = 'Перша сторінка';
        this.pagIntl.lastPageLabel = 'Остання сторінка';
        this.pagIntl.nextPageLabel = 'Наступна сторінка';
        this.pagIntl.previousPageLabel = 'Попередня сторінка';
        this.pagIntl.itemsPerPageLabel = 'Кількість елементів';

        this.route.queryParams.subscribe(params => {
            params.page ? this.pageIndex = +params.page - 1 : this.pageIndex = 0;
            this.getSubjects();
        });

        this.searchBoxSubscr = this.searchBox.valueChanges
            .debounceTime(1000)
            .subscribe(newValue => {
                if (newValue !== '') {
                    this.pagination = false;
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
                } else {
                    this.getSubjects();
                }
            });
    }

    getSubjects(event?): void {
        this.pagination = true;
        if (event) {
            this.pageIndex = event.pageIndex;
            this.pageSize = event.pageSize;
            this.router.navigate(['admin/subjects'], {queryParams: {page: this.pageIndex + 1}});
        } else {
            this.subjectService.countSubjects().subscribe((data: any) =>
                this.length = +data.numberOfRecords);

            this.subjectService.getSubjectsRange(this.pageSize, this.pageSize * this.pageIndex).subscribe((subjects: any) => {
                if (subjects.response) {
                    this.paginator.firstPage();
                    this.dialog.open(ResponseMessageComponent, {
                        width: '400px',
                        data: {
                            message: 'Сторінка відсутня, скеровано на початкову'
                        },
                    });
                } else {
                    this.subjects = subjects;
                }

            });
        }

    }


    getTimetable(id: number): void {
        this.router.navigate(['admin/timetable'], {
            queryParams: {subjectId: id},
        });
    }

    getTests(id: number): void {
        this.router.navigate(['admin/tests'], {queryParams: {subjectId: id}});
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
                            if (this.subjects.length > 1) {
                                this.getSubjects();
                            } else {
                                this.paginator.previousPage();
                            }
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
