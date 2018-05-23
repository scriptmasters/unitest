import {Component, OnDestroy, OnInit} from '@angular/core';
import {StudentsService} from './students.service';
import {StudentsModalWindowComponent} from './students-modal-window/students-modal-window.component';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {MatDialog, MatPaginatorIntl, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import IStudent from './interfaces/IStudent';
import IResponse from './interfaces/IResponse';
import IGroup from './interfaces/IGroup';
import IFaculty from './interfaces/IFaculty';
import {getGroupsByFaulty} from './reusable-functions/get-groups-by-faculty';
import {getFiltredStudents} from './reusable-functions/get-filtred-students';
import {setGroupAsID} from './reusable-functions/set-group-as-id';
import IResolvedData from './interfaces/IResolvedData';
import {HttpClient} from '@angular/common/http';
import {Pagination} from '../../shared/pagination/pagination.class';
import {PaginationService} from '../../shared/pagination/pagination.service';
import {Subscription} from 'rxjs/Subscription';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.scss'],
    providers: [StudentsService]
})
export class StudentsComponent extends Pagination implements OnInit, OnDestroy {

    groups: IGroup[] = [];
    faculties: IFaculty[] = [];
    facultyString = 'Виберіть факультет';
    groupString = 'Виберіть групу';
    students: IStudent[] = [];
    byGroup: boolean;
    search = new FormControl();
    searchSubscr: Subscription;

    constructor(private service: StudentsService,
                public router: Router,
                public route: ActivatedRoute,
                public pagIntl: MatPaginatorIntl,
                public http: HttpClient,
                public dialog: MatDialog,
                public pagService: PaginationService,
                public snackBar: MatSnackBar) {
        super(router, route, pagIntl, http, dialog, pagService, snackBar);
        this.pagService.entity = 'Student';
        this.entities = 'students';
    }

    ngOnInit() {
        this.route.data.subscribe((data: { resolvedStudents: IResolvedData }) => {
            this.students = data.resolvedStudents.students;
            this.byGroup = data.resolvedStudents.byGroup;
            this.service.getAvailableFaculties().subscribe(res => {
                this.faculties = res;
                if (this.byGroup) {
                    this.faculties.forEach((value: any) => {

                        if (value.faculty_id === this.students[0].faculty_id) {
                            this.facultyString = value.faculty_name;
                        }
                    });
                    this.groups = [{group_id: undefined, group_name: this.students[0].group}];
                    this.groupString = this.students[0].group;
                    if (this.students[0].gradebook_id === '') {
                        this.students.pop();
                    }
                }
            });
            this.countingStudents();
            this.searchStd();
            this.initLogic(true);
            this.byGroup ? this.pagService.pagSubscr.next(false) : this.pagService.pagSubscr.next(true);
        });

    }

    ngOnDestroy() {
        this.destroyLogic();
    }

    countingStudents() {
        this.service.countStudent().subscribe(response => this.pagService.fullLength = +response.numberOfRecords);
    }

    searchStd() {
        this.searchSubscr = this.search.valueChanges
            .debounceTime(1000)
            .subscribe(newValue => {
                if (newValue !== '') {
                    this.pagService.pagSubscr.next(false);
                    this.pagService.getSearchedEntities(newValue)
                        .subscribe(
                            (data: any) => {
                                if (data.response === 'no records') {
                                    this.students = undefined;
                                } else {
                                    this.processDataFromAPI(data);
                                }
                            },
                            () => {
                                this.students = undefined;
                                this.pagService.pagSubscr.next(false);
                            }
                        );
                } else {
                    this.updateData(this.pageSize, this.pageIndex);

                }
            });
    }

    // Opening creating student form
    showRegForm(user?: IStudent): void {
        this.openStudentsModalWindow(user, true, false, false, true, 'Додати студента')
            .afterClosed().subscribe((Response: any) => {
            if (Response) {
                if (Response.response === 'ok') {
                    this.openTooltip('Профіль цього студента було успішно додано!');
                    this.updateData(this.pageSize, this.pageIndex);
                    this.countingStudents();
                } else if (Response.error || Response.response === 'Failed to validate array') {
                    this.openModalMessage('Виникла помилка при додаванні цього студента!');
                }
            }
        });
    }

    // Editing student
    showEditForm(user: IStudent): void {
        this.openStudentsModalWindow(user, true, true, false, false, 'Редагувати студента')
            .afterClosed().subscribe((Response: any) => {
            if (Response) {
                if (Response.response === 'ok') {
                    this.openTooltip('Профіль цього студента було успішно оновлено!');
                    this.updateData(this.pageSize, this.pageIndex);
                } else if (Response.error || Response.response === 'Error when update') {
                    this.openModalMessage('Виникла помилка при редагуванні профілю цього студента!');
                }
            }
        });
    }

    // Extended info about student
    showAdvancedInfo(user: IStudent): void {
        this.openStudentsModalWindow(user, false, false, true, false);
    }

    // opening students modal window to make CRUD operations
    openStudentsModalWindow(userdata: IStudent, edit: boolean, update: boolean, read: boolean, create: boolean, text?: string) {
        return this.dialog.open(StudentsModalWindowComponent, {
            disableClose: true,
            width: '600px',
            height: 'calc(100vh - 50px)',
            data: {
                student: userdata,
                editing: edit,
                updating: update,
                reading: read,
                creating: create,
                submitButtonText: text
            }
        });
    }

    // to update data after changes(deleting, editing)
    updateData(page, index): void {
        this.pageSize = page;
        this.pageIndex = index;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.service.getStudentsByGroup(id).subscribe(
                (data: IStudent[] & IResponse) => this.processDataFromAPI(data),
                () => this.openModalMessage('Сталась помилка при завантаженні даних')
            );
        }
        if (!id) {
            this.service.getStudents(page, index).subscribe(
                (data: IStudent[] & IResponse) => this.processDataFromAPI(data),
                () => this.openModalMessage('Сталась помилка при завантаженні даних')
            );
        }
    }

    // Processing data
    processDataFromAPI(data: IStudent[] & IResponse) {
        // If there is no students in the current group don't process data
        if (data.response === 'no records') {
            this.students = undefined;
        } else {
            let groupsArr: any[] = data.map(value => value.group_id);
            const body = JSON.stringify({entity: 'Group', ids: groupsArr});
            this.service.getEntityValue(body).subscribe(response => {
                groupsArr = response;
                // Updating array students
                this.students = getFiltredStudents(data, groupsArr);

                if (this.byGroup) {
                    this.pagService.pagSubscr.next(false);
                } else {
                    this.countingStudents();
                    this.pagService.pagSubscr.next(true);
                }
            });


        }
    }

    // Deleting student
    handleDelete(index): void {
        const dialogRef = this.dialog.open(DeleteConfirmComponent, {
            width: '400px',
            data: {
                message: 'Ви справді бажаєте видалити профіль цього студента?'
            }
        });
        dialogRef.afterClosed().subscribe((Response: boolean) => {
            if (Response) {
                this.service.deleteStudent(index).subscribe((data: IResponse) => {
                        if (data.response === 'ok') {
                            this.countingStudents();
                            this.openTooltip('Профіль цього студента було успішно видалено!');
                            if (this.students.length > 1) {
                                this.updateData(this.pageSize, this.pageIndex);
                            } else {
                                this.pagination ? this.paginator.previousPage() : this.students = undefined;
                            }
                        }
                    },
                    () => {
                        this.openModalMessage('Виникла помилка при видаленні цього студента!');
                    });
            }
        });
    }

    // Dialog modal message
    openModalMessage(msg: string, w: string = '400px'): void {
        this.dialog.open(ResponseMessageComponent, {
            width: w,
            data: {
                message: msg
            }
        });
    }

    // This method is called to create new students array
    getGroups(elem: HTMLSelectElement) {
        const index = getGroupsByFaulty(elem, true, this.faculties);
        if (index) {
            // Request for the available groups
            this.service.getAvailableGroups(index).subscribe(data => {
                if (data[0]) {
                    this.groups = data;
                    // if there is no available group
                } else {
                    this.groups = [];
                }
            });
        }
    }

    // filters students by group
    getFiltredStudentsByGroup(elem: HTMLSelectElement) {
        const index = setGroupAsID(elem, this.groups);
        if (index) {
            this.router.navigate([`admin/students/${index}`]);
        }
    }

    // back to groups
    backToGroups() {
        this.router.navigate(['admin/groups/']);
    }

    // look at all students
    reviseAllStudents() {
        this.router.navigate(['admin/students/']);
    }

}

