import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { StudentsService } from '../students.service';

import { StudentAdd } from '../students-interface';
import { Groups } from '../students-interface';
import { Faculties } from '../students-interface';
import { defaultImage } from './default-image'
import { IResponse } from '../students-interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-student-registration-form',
  templateUrl: './student-registration-form.component.html',
  styleUrls: ['./student-registration-form.component.scss'],
  providers: [ StudentsService ],
  encapsulation: ViewEncapsulation.None
})
export class StudentRegistrationFormComponent implements OnInit {

  form;
  groups: Groups[] = [];
  faculties: Faculties[] = [];
  //Властивості, які вибираються з інпутів з використання "2 way data binding"
  student: StudentAdd = {
    gradebook_id: '',
    student_surname: '',
    student_name: '',
    student_fname: '',
    group_id: '',
    password: '',
    username: '',
    email: '',
    photo: defaultImage
  }

  constructor(
    private service: StudentsService, 
    private dialogRef: MatDialogRef<StudentRegistrationFormComponent>) { }

  ngOnInit() {
    //Підгружаємо дані факультетів і груп з сервера при першій ініціалізації компоненту
    this.service.getAvailableFaculties().subscribe(response => {
      this.faculties = response;
      this.service.getAvailableGroups('1').subscribe(data => {
        this.groups = data;
        this.student.group_id = this.groups[0].group_id;
      });
    });
    //Валідація форми
    this.form = new FormGroup({
      firstname: new FormControl(''),
      surname: new FormControl(''),
      fname: new FormControl(''),
      gradebook: new FormControl(''),
      login: new FormControl(''),
      password: new FormControl(''),
      email: new FormControl('')
    });
  }
  //Записуємо масив об'єктів "Group" які приходять з сервера в масив "groups"
  getGroups(elem: HTMLSelectElement) {
    let value = elem.options[elem.selectedIndex].value;
    let index: string;
    //Шукаємо айдішку факультету яку було вибрано в селекті
    this.faculties.forEach(val => {
      if(val.faculty_name === value) {
        index = val.faculty_id;
      }
    });
    //По айдішці факультету витягуємо всі його групи і записуємо в масив groups, якщо є групи в цьому факультеті
    this.service.getAvailableGroups(index).subscribe(data => {
      if (data[0]) {
        this.groups = data;
        this.student.group_id = this.groups[0].group_id;
      //якщо факультет по якихось причинах немає груп, ЛОЛ :)
      } else {
        this.groups = [{
          group_id: 'none',
          group_name: 'Немає зареєстрованих груп для даного факультету',
          speciality_id: 'none',
          faculty_id: 'none'
        }]
      }
    });
  }
  //Сетим айдішку групи в об'єкт "student"
  handleSetGroup(elem: HTMLSelectElement) {
    let value = elem.options[elem.selectedIndex].value;
    let index: string;
    this.groups.forEach(val => {
      if(val.group_name === value) {
        index = val.group_id;
      }
    });
    this.student.group_id = index;
  }
  //Рендеримо фотку в base64 код перед відправкою на сервер
  handleAddPhoto(event) {
    let input = event.target;
    const reader = new FileReader();
    const that = this;
    reader.onload = function() {
      let dataURL = reader.result;
      console.log(dataURL);
      that.student.photo = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
  }
  //Відправляємо дані на сервер
  handleSubmit() {
    let studentJSON = JSON.stringify({
      gradebook_id: this.student.gradebook_id,
      student_surname: this.student.student_surname,
      student_name: this.student.student_name,
      student_fname: this.student.student_fname,
      group_id: this.student.group_id,
      password: this.student.password,
      username: this.student.username,
      email: this.student.email,
      photo: this.student.photo,
      password_confirm: this.student.password,
      plain_password: this.student.password
    });
    this.service.addStudent(studentJSON).subscribe((data: IResponse) => {
      if (data.response === 'ok') {
        this.dialogRef.close();
      }
    });
  }
}
