import { Component, OnInit } from '@angular/core';
import { StudentsService } from './students.service';
import { StudentGet, IResponse } from './students-interface';
import { Student } from './students-interface';
import { group } from '@angular/animations';
import { StudentRegistrationFormComponent } from './student-registration-form/student-registration-form.component';
import { StudentEditFormComponent } from './student-edit-form/student-edit-form.component';
import { StudentDeleteConfirmComponent } from './student-delete-confirm/student-delete-confirm.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [ StudentsService ]
})
export class StudentsComponent implements OnInit {

  title: string = 'Студенти';
  students: Student[] = [];

  constructor(private service: StudentsService, private dialog: MatDialog) { }

  ngOnInit() {
    //При кожному ререндері компоненту будуть братись нові дані з сервера
    this.fillOutStudentsTable();
  }
  // Відкриває діалогове вікно
  showRegForm(): void {
    let dialogRef = this.dialog.open(StudentRegistrationFormComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe((Response: string) => {
      if (Response) {
        if (Response === 'ok') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Профіль цього студента було успішно додано!'
            }
          })
          this.fillOutStudentsTable();
        } else if (Response.toLowerCase().includes("error")) {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Виникла помилка при додаванні цього студента!'
            }
          })
        }
      }
    });
  }
  //Редагування студента
  showEditForm(user: Student): void {
    let dialogRef = this.dialog.open(StudentEditFormComponent, {
      width: '600px',
      data: {
        editing: true,
        student: user
      }
    });
    dialogRef.afterClosed().subscribe((Response: string) => {
      if (Response) {
        if (Response === 'ok') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Профіль цього студента було успішно відредаговано!'
            }
          })
          this.fillOutStudentsTable();
        } else if (Response.toLowerCase().includes("error")) {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Виникла помилка при редагуванні цього студента!'
            }
          })
        }
      }
    });
  }
  //Розширена інформація про студента
  showAdvancedInfo(user: Student): void {
    this.dialog.open(StudentEditFormComponent, {
      width: '600px',
      data: {
        editing: false,
        student: user
      }
    });
  }
  // метод який записує в масив "students" дані про кожного студента
  fillOutStudentsTable(): void {
    this.service.getStudents().subscribe(data => {
      let groupsArr = [];
      for (let i = 0; i < data.length; i++) {
        groupsArr.push(data[i].group_id);
      }
      let body = JSON.stringify({entity: "Group", ids: groupsArr});
      this.service.getEntityValue(body).subscribe(response => {
        // Фільтр для властивостей об'єкта
        groupsArr = response.map(val => {
          return {
            group_id: val.group_id,
            group_name: val.group_name
          }
        });
        this.students = [];
        // Додавання студентів в масив "students"
        for (let i = 0; i < data.length; i++) {
          this.students.push({
            student_fname: data[i].student_fname,
            student_name: `${data[i].student_name} `,
            student_surname: `${data[i].student_surname} `,
            gradebook_id: data[i].gradebook_id,
            user_id: data[i].user_id,
            group_id: data[i].group_id,
            group: ''
          });
          // Додавання групи кожному студенту
          for (let j = 0; j < groupsArr.length; j++) {
            if (data[i].group_id === groupsArr[j].group_id) {
              this.students[i].group = groupsArr[j].group_name;
            }
          }
        }
      });
    });
  }
  //Видалення студента
  handleDelete(index): void {
    let dialogRef = this.dialog.open(StudentDeleteConfirmComponent, {
      width: '400px',
      data: {
        id: index
      }
    });
    dialogRef.afterClosed().subscribe((Response: string) => {
      if (Response) {
        if (Response === 'ok') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Профіль цього студента було успішно видалено!'
            }
          })
          this.fillOutStudentsTable();
        } else if (Response.toLowerCase().includes("error")) {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Виникла помилка при видаленні цього студента!'
            }
          })
        }
      }
    });
  }
}
