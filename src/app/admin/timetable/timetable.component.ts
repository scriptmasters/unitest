import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatPaginatorIntl, MatSnackBar} from '@angular/material';
import {Group, Subject, TableItem, TableService} from './timetable.service';
import {TimeTableModalComponent} from './timetable-modal/timetable-modal.component';
import {TimetableDeleteConfirmComponent} from './timetable-delete-confirm/timetable-delete-confirm.component';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {Pagination} from '../../shared/pagination/pagination.class';
import {HttpClient} from '@angular/common/http';
import {PaginationService} from '../../shared/pagination/pagination.service';

interface TableItemModified extends TableItem {
    subject_name: string;
    group_name: string;
}

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.css'],
    providers: [TableService]
})
export class TimetableComponent extends Pagination implements OnInit, OnDestroy {
    table: TableItemModified[] = [];
    subjects: Subject[] = [];
    groups: Group[] = [];

    groupsMap: Map<string, string> = new Map();
    subjectsMap: Map<string, string> = new Map();
    hideColumn = false;
    constructor(public tableService: TableService,
                public router: Router,
                public route: ActivatedRoute,
                public pagIntl: MatPaginatorIntl,
                public http: HttpClient,
                public dialog: MatDialog,
                public pagService: PaginationService,
                public snackBar: MatSnackBar) {
        super(router, route, pagIntl, http, dialog, pagService, snackBar);
        const onSuccess = async data => {
            await tableService
                .getGroups()
                .toPromise()
                .then((groups: Group[]) => {
                    this.groups = groups;

                    groups.forEach(group =>
                        this.groupsMap.set(group.group_id, group.group_name)
                    );
                });

            await tableService
                .getSubjects()
                .toPromise()
                .then((subjects: Subject[]) => {
                    this.subjects = subjects;

                    subjects.forEach(subject =>
                        this.subjectsMap.set(subject.subject_id, subject.subject_name)
                    );
                });

            // If no records found
            if (!Array.isArray(data)) {
                this.table = [];
                this.dialog.open(ResponseMessageComponent, {
                    width: '400px',
                    data: {
                        message: 'За даним запитом розкладу не знайдено'
                    }
                });
                return;
            }

            this.table = data.map((timeEntity: TableItem): TableItemModified => {
                return Object.assign({}, timeEntity, {
                    group_name: this.groupsMap.get(timeEntity.group_id),
                    subject_name: this.subjectsMap.get(timeEntity.subject_id)
                });
            });
        };

        const onError = () => (this.table = []);

        this.route.queryParams.subscribe(params => {
            if (params.subjectId) {
                this.hideColumn = true;
                tableService
                    .getTableBySubjectId(params.subjectId)
                    .subscribe(onSuccess, onError);
            } else if (params.groupId) {
                this.hideColumn = true;
                tableService
                    .getTableByGroupId(params.groupId)
                    .subscribe(onSuccess, onError);
            } else {
                this.hideColumn = false;
                tableService.getTable().subscribe(onSuccess, onError);
            }
        });
    }

    /**
     * Delete table item
     * id of table item to delete
     */
    onDelete(timeEntity: TableItemModified) {
        const dialogRef = this.dialog.open(TimetableDeleteConfirmComponent, {
            width: '400px'
        });

        dialogRef.afterClosed().subscribe((response: string) => {
            if (response) {
                if (response === 'ok') {
                    this.tableService.deleteTableItem(timeEntity.timetable_id).subscribe(
                        () => {
                            this.table.splice(this.table.indexOf(timeEntity), 1);
                            this.openTooltip('Розклад успішно видалено');
                            if (this.pagService.paginatedLength === 1) {
                                this.paginator.previousPage();
                            }
                        },
                        err => {
                            console.error('err:', err);
                            this.dialog.open(ResponseMessageComponent, {
                                width: '400px',
                                data: {
                                    message: 'Виникла помилка при видаленні розкладу!'
                                }
                            });
                        }
                    );
                }
            }
        });
    }

    /**
     * Opens dialog to create table entity or edit it
     * table item we want to edit
     * if not presented we open modal to add new entity
     */
    openDialog(tableItem?: TableItemModified): void {
        const dialogRef = this.dialog.open(TimeTableModalComponent, {
            width: '650px',
            data: {
                table: this.table,
                subjects: this.subjects,
                groups: this.groups,
                groupsMap: this.groupsMap,
                subjectsMap: this.subjectsMap,
                tableItem
            }
        });

        dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result === 'Редагування успішно завершено') {
                        this.openTooltip('Редагування успішно завершено');
                    } else {
                        if (result === 'Додавання успішно завершено') {
                            this.openTooltip('Додавання успішно завершено');
                        } else {
                            this.dialog.open(ResponseMessageComponent, {
                                width: '400px',
                                data: {
                                    message: result
                                }
                            });
                        }
                    }
                }
            }
        );
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.initLogic(true);
    }

    ngOnDestroy() {
        this.destroyLogic();
    }
}
