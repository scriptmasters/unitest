import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StudentsService } from '../students.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import IGroup from '../interfaces/IGroup';
import IFaculty from '../interfaces/IFaculty';
import IStudent from '../interfaces/IStudent';
import IUser from '../interfaces/IUser';
import IResponse from '../interfaces/IResponse';

@Component({
  selector: 'app-student-edit-form',
  templateUrl: './student-edit-form.component.html',
  styleUrls: ['./student-edit-form.component.scss'],
  providers: [ StudentsService ],
  encapsulation: ViewEncapsulation.None
})
export class StudentEditFormComponent implements OnInit {

  form;
  groups: IGroup[] = [];
  faculties: IFaculty[] = [];
  // Властивості, які вибираються з інпутів з використання "2 way data binding"
  student: IStudent = {
    user_id: '',
    gradebook_id: '',
    student_surname: '',
    student_name: '',
    student_fname: '',
    group_id: '',
    plain_password: '',
    photo: '',
  };
  studentInfo: IUser = {
    id: '',
    username: '',
    password: '',
    logins: '',
    last_login: '',
    email: ''
  };
  studentGroup: IGroup = {
    group_id: '',
    group_name: '',
    speciality_id: '',
    faculty_id: ''
  };
  studentFaculty: IFaculty = {
    faculty_id: '',
    faculty_name: '',
    faculty_description: ''
  };

  constructor(
    private service: StudentsService,
    public dialogRef: MatDialogRef<StudentEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    // Запити на сервер, для відображення інформації про поточного студента
    this.service.getPickedStudent(this.data.student.user_id).subscribe(data => {
      this.student = data[0];
    });
    this.service.getUserInfo(this.data.student.user_id).subscribe(response => {
      this.studentInfo = response[0];
    });
    const group = JSON.stringify({entity: 'Group', ids: [this.data.student.group_id]});
    this.service.getEntityValue(group).subscribe(resp => {
      this.studentGroup = resp[0];
      const faculty = JSON.stringify({entity: 'Faculty', ids: [this.studentGroup.faculty_id]});
      this.service.getEntityValue(faculty).subscribe(val => {
        this.studentFaculty = val[0];
        this.service.getAvailableFaculties().subscribe(value => {
          this.faculties = value;
          this.service.getAvailableGroups(this.studentFaculty.faculty_id).subscribe(values => {
            this.groups = values;
          });
        });
      });
    });
    // Валідація форми
    this.form = new FormGroup({
      firstname: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ])),
      surname: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ])),
      fname: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ])),
      gradebook: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])),
      login: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])),
      password: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])),
      email: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.email
      ])),
      group: new FormControl(null, this.handleGroupValidator)
    });
  }
  // Записуємо масив об'єктів "Group" які приходять з сервера в масив "groups"
  getGroups(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    let index: string;
    // Шукаємо айдішку факультету яку було вибрано в селекті
    this.faculties.forEach(val => {
      if (val.faculty_name === value) {
        index = val.faculty_id;
      }
    });
    // По айдішці факультету витягуємо всі його групи і записуємо в масив groups, якщо є групи в цьому факультеті
    this.service.getAvailableGroups(index).subscribe(data => {
      if (data[0]) {
        this.groups = data;
        this.student.group_id = this.groups[0].group_id;
      // якщо факультет по якихось причинах немає груп
      } else {
        this.groups = [{
          group_id: '',
          group_name: 'Немає груп',
          speciality_id: '',
          faculty_id: ''
        }];
      }
    });
  }
  // Сетим айдішку групи в об'єкт "student"
  handleSetGroup(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    let index: string;
    this.groups.forEach(val => {
      if (val.group_name === value) {
        index = val.group_id;
      }
    });
    this.student.group_id = index;
  }
  // Валідатор для груп
  handleGroupValidator(control) {
    if (control.value === 'Немає груп' || control.value === '') {
      return {
        'group': true
      };
    }
  }
  // Рендеримо фотку в base64 код перед відправкою на сервер
  handleAddPhoto(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      this.student.photo = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
  }
  // Відправляємо дані на сервер
  handleSubmit(value) {
    const studentJSON = JSON.stringify({
      gradebook_id: value.gradebook,
      student_surname: value.surname,
      student_name: value.firstname,
      student_fname: value.fname,
      group_id: this.student.group_id,
      password: value.password,
      username: value.login,
      email: value.email,
      photo: this.student.photo,
      password_confirm: value.password,
      plain_password: value.password
    });
    this.service.editStudent(this.data.student.user_id, studentJSON).subscribe(
      (data: IResponse) => this.dialogRef.close(data.response),
      error => this.dialogRef.close(error.error.response)
    );
  }
  // Щоб побачити пароль
  handleTogglePasswordVisibility(elem: HTMLInputElement) {
    if (elem.type === 'password') {
      elem.type = 'text';
    } else {
      elem.type = 'password';
    }
  }
  // Метод який закриває діалогове вікно
  handleClose(): void {
    this.dialogRef.close();
  }
}
