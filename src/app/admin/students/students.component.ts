import { Component, OnInit } from '@angular/core';
import { StudentsService } from './students.service';
import { group } from '@angular/animations';
import { StudentRegistrationFormComponent } from './student-registration-form/student-registration-form.component';
import { StudentEditFormComponent } from './student-edit-form/student-edit-form.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { MatDialog } from '@angular/material';
import { PaginationInstance } from 'ngx-pagination';
import { ActivatedRoute } from '@angular/router';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import IStudent from './interfaces/IStudent';
import IResponse from './interfaces/IResponse';
import IGroup from './interfaces/IGroup';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [ StudentsService ]
})
export class StudentsComponent implements OnInit {

  searchString = '';
  students: IStudent[] = [];
  // Для пагінації
  public config: PaginationInstance = {
    itemsPerPage: 5,
    currentPage: 1
  };

  constructor(
    private service: StudentsService,
    private dialog: MatDialog,
    private route: ActivatedRoute) {}

  ngOnInit() {
    // При кожному ререндері компоненту будуть братись нові дані з сервера
    this.route.params.subscribe(params => this.fillOutStudentsTable(params.id));
  }
  // Відкриває діалогове вікно
  showRegForm(): void {
    const dialogRef = this.dialog.open(StudentRegistrationFormComponent, {
      width: '600px',
      height: 'calc(100vh - 50px)',
    });
    dialogRef.afterClosed().subscribe((Response: string) => {
      if (Response) {
        if (Response === 'ok') {
          this.openModalMessage('Профіль цього студента було успішно додано!');
          this.fillOutStudentsTable();
        } else if (Response.toLowerCase().includes('error')) {
          this.openModalMessage('Виникла помилка при додаванні цього студента!');
        }
      }
    });
  }
  // Редагування студента
  showEditForm(user: IStudent): void {
    const dialogRef = this.dialog.open(StudentEditFormComponent, {
      width: '600px',
      height: 'calc(100vh - 50px)',
      data: {
        editing: true,
        student: user
      }
    });
    dialogRef.afterClosed().subscribe((Response: string) => {
      if (Response) {
        if (Response === 'ok') {
          this.openModalMessage('Профіль цього студента було успішно оновлено!');
          this.fillOutStudentsTable();
        } else if (Response.toLowerCase().includes('error')) {
          this.openModalMessage('Виникла помилка при редагуванні профілю цього студента!');
        }
      }
    });
  }
  // Розширена інформація про студента
  showAdvancedInfo(user: IStudent): void {
    this.dialog.open(StudentEditFormComponent, {
      width: '600px',
      height: 'calc(100vh - 50px)',
      data: {
        editing: false,
        student: user
      }
    });
  }
  // метод який записує в масив "students" дані про кожного студента
  fillOutStudentsTable(id?: any): void {
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
    // Щоб не кидало реквест на сервак, якщо нема студентів в групі
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
      // Додавання студентів в масив "students"
      this.students = this.fillOutStudentsArray(data, groupsArr);
    });
  }
  // Видалення студента
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
            this.fillOutStudentsTable();
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
        }
      });
      return student;
    });
  }
}
