import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StudentsService } from './students.service';
import { StudentsModalWindowComponent } from './students-modal-window/students-modal-window.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { MatDialog } from '@angular/material';
import { PaginationInstance } from 'ngx-pagination';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import IStudent from './interfaces/IStudent';
import IResponse from './interfaces/IResponse';
import IGroup from './interfaces/IGroup';
import IFaculty from './interfaces/IFaculty';
import { getGroupsByFaulty } from './reusable-functions/get-groups-by-faculty';
import { getFiltredStudents } from './reusable-functions/get-filtred-students';
import { setGroupAsID } from './reusable-functions/set-group-as-id';
import { Subject } from 'rxjs/Subject';
import IResolvedData from './interfaces/IResolvedData';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [ StudentsService ]
})
export class StudentsComponent implements OnInit {

  searchStdSubscr: Subscription;
  groups: IGroup[] = [];
  faculties: IFaculty[] = [];
  facultyString = 'Виберіть факультет';
  groupString = 'Виберіть групу';
  searchString = new Subject<string>();
  students: IStudent[] = [];
  byGroup: boolean;
  // NgXPagination
  public config: PaginationInstance = {
    itemsPerPage: 5,
    currentPage: 1
  };
  @ViewChild('searchField') searchField: ElementRef;

  constructor(
    private service: StudentsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe((data: { resolvedStudents: IResolvedData }) => {
      this.students = data.resolvedStudents.students;
      this.byGroup = data.resolvedStudents.byGroup;
    });
    this.service.getAvailableFaculties().subscribe(res => this.faculties = res);
  }
  searchStudent() {
    this.searchStdSubscr = this.service.searchStudents(this.searchString)
      .subscribe(
        data => {
          this.processDataFromAPI(data);
        },
        error => {
          this.openModalMessage(error.status);
          this.searchField.nativeElement.value = '';
          this.searchField.nativeElement.blur();
        }
      );
  }
  unsubSearch() {
    this.searchStdSubscr.unsubscribe();
  }
  // Opening creating student form
  showRegForm(user: IStudent): void {
    this.openStudentsModalWindow(user, true, false, false, true, 'Додати студента')
      .afterClosed().subscribe((Response: any) => {
        if (Response) {
          if (Response.response === 'ok') {
            this.openModalMessage('Профіль цього студента було успішно додано!');
            this.updateData();
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
            this.openModalMessage('Профіль цього студента було успішно оновлено!');
            this.updateData();
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
  updateData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getStudentsByGroup(id).subscribe(
        (data: IStudent[]&IResponse) => this.processDataFromAPI(data),
        () => this.openModalMessage('Сталась помилка при завантаженні даних')
    );
    }
    if (!id) {
      this.service.getStudents().subscribe(
        (data: IStudent[]&IResponse) => this.processDataFromAPI(data),
        () => this.openModalMessage('Сталась помилка при завантаженні даних')
      );
    }
  }
  // Processing data
  processDataFromAPI(data: IStudent[]&IResponse) {
    // If there is no students in the current group don't process data
    if (data.response === 'no records') {
      this.openModalMessage('Немає зареєстрованих студентів в даній групі!');
      return;
    }
    let groupsArr: any[] = data.map(value => value.group_id);
    const body = JSON.stringify({entity: 'Group', ids: groupsArr});
    this.service.getEntityValue(body).subscribe(response => {
      groupsArr = response;
      // Updating array students
      this.students = getFiltredStudents(data, groupsArr);
    });
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
            this.openModalMessage('Профіль цього студента було успішно видалено!');
            this.updateData();
          }},
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
    console.log(index);
    if (index) {
      this.service.getStudentsByGroup(index).subscribe(
        (data: IStudent[]&IResponse) => this.processDataFromAPI(data),
        () => this.openModalMessage('Сталась помилка при завантаженні даних')
      );
    }
  }
  // clear filters
  resetFilters(): void {
    this.searchField.nativeElement.value = '';
    this.facultyString = 'Виберіть факультет';
    this.groupString = 'Виберіть групу';
    this.updateData();
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
