import { Component, OnInit } from '@angular/core';
import { StudentsService } from './students.service';
import { group } from '@angular/animations';
import { StudentsModalWindowComponent } from './students-modal-window/students-modal-window.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { MatDialog } from '@angular/material';
import { PaginationInstance } from 'ngx-pagination';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import IStudent from './interfaces/IStudent';
import IResponse from './interfaces/IResponse';
import IGroup from './interfaces/IGroup';
import { StudentsResolver } from './students-resolver.service';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [ StudentsService ]
})
export class StudentsComponent implements OnInit {

  searchString = '';
  students: IStudent[] = [];
  // NgXPagination
  public config: PaginationInstance = {
    itemsPerPage: 5,
    currentPage: 1
  };

  constructor(
    private service: StudentsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.students = this.route.snapshot.data['students'];
  }
  // Opening creating student form
  showRegForm(user: IStudent): void {
    const dialogRef = this.dialog.open(StudentsModalWindowComponent, {
      width: '600px',
      height: 'calc(100vh - 50px)',
      data: {
        editing: true,
        creating: true,
        student: user,
        submitButtonText: 'Додати студента'
      }
    });
    dialogRef.afterClosed().subscribe((Response: any) => {
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
    const dialogRef = this.dialog.open(StudentsModalWindowComponent, {
      width: '600px',
      height: 'calc(100vh - 50px)',
      data: {
        editing: true,
        updating: true,
        student: user,
        submitButtonText: 'Редагувати студента'
      }
    });
    dialogRef.afterClosed().subscribe((Response: any) => {
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
    this.dialog.open(StudentsModalWindowComponent, {
      width: '600px',
      height: 'calc(100vh - 50px)',
      data: {
        editing: false,
        updating: false,
        reading: true,
        student: user
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
      // Reseting existing array
      this.students = [];
      // Adding students to array "students"
      this.students = this.fillOutStudentsArray(data, groupsArr);
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
  fillOutStudentsArray(response: IStudent[], groups: IGroup[]): IStudent[] {
    return response.map(value => {
      const student: IStudent = {
        student_fname: value.student_fname,
        student_name: `${value.student_name} `,
        student_surname: `${value.student_surname} `,
        fullName: `${value.student_surname} ${value.student_name} ${value.student_fname}`,
        gradebook_id: value.gradebook_id,
        user_id: value.user_id,
        group_id: value.group_id,
        group: ''
      };
      // Adding group name to display it at table
      groups.forEach(val => {
        if (value.group_id === val.group_id) {
          student.group = val.group_name;
          student.faculty_id = val.faculty_id;
        }
      });
      return student;
    });
  }
}
