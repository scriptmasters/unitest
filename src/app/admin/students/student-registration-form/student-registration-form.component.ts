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
      // this.service.getAvailableGroups('1').subscribe(data => {
      //   this.groups = data;
      //   this.student.group_id = this.groups[0].group_id;
      // });
    });
    //Валідація форми
    this.form = new FormGroup({
      firstname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ])),
      surname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ])),
      fname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ])),
      group: new FormControl(null, this.handleGroupValidator),
      faculty: new FormControl(null, this.handleFacultyValidator),
      gradebook: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])),
      login: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.email
      ]))
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
          group_name: '---',
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
  //Валідатор для груп
  handleGroupValidator(control) {
    if (control.value === 'Виберіть групу' || control.value === '---' || control.value === null) {
      return {
        'group': true
      }
    }
  }
  //Валідатор для факультетів
  handleFacultyValidator(control) {
    if (control.value === 'Виберіть факультет' || control.value === null) {
      return {
        'faculty': true
      }
    }
  }
  //Рендеримо фотку в base64 код перед відправкою на сервер
  handleAddPhoto(event) {
    let input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      let dataURL = reader.result;
      this.student.photo = dataURL;
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
    this.service.addStudent(studentJSON).subscribe(
      (data: IResponse) => this.dialogRef.close(data.response),
      error => this.dialogRef.close(error.error.response)
    );
  }
}
