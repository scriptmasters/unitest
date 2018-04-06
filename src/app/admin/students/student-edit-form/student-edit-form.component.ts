import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { StudentsService } from '../students.service';
import { StudentAdd, StudentGet, IUser, GroupNameByID } from '../students-interface';
import { Groups } from '../students-interface';
import { Faculties } from '../students-interface';
import { IResponse } from '../students-interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-student-edit-form',
  templateUrl: './student-edit-form.component.html',
  styleUrls: ['./student-edit-form.component.scss'],
  providers: [ StudentsService ],
  encapsulation: ViewEncapsulation.None
})
export class StudentEditFormComponent implements OnInit {

  form;
  groups: Groups[] = [];
  faculties: Faculties[] = [];
  //Властивості, які вибираються з інпутів з використання "2 way data binding"
  student: StudentGet = {
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
  studentGroup: GroupNameByID = {
    group_id: '',
    group_name: '',
    speciality_id: '',
    faculty_id: ''
  };
  studentFaculty: Faculties = {
    faculty_id: '',
    faculty_name: '',
    faculty_description: ''
  };

  constructor(
    private service: StudentsService, 
    public dialogRef: MatDialogRef<StudentEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.service.getPickedStudent(this.data.id).subscribe(data => {
      this.student = data[0];
      this.service.getUserInfo(this.data.id).subscribe(response => {
        this.studentInfo = response[0];
        let group = JSON.stringify({entity: "Group", ids: [this.student.group_id]});
        this.service.getEntityValue(group).subscribe(resp => {
          this.studentGroup = resp[0];
          let faculty = JSON.stringify({entity: "Faculty", ids: [this.studentGroup.faculty_id]});
          this.service.getEntityValue(faculty).subscribe(val => {
            this.studentFaculty = val[0];
            this.service.getAvailableFaculties().subscribe(value => {
              this.faculties = value;
              this.service.getAvailableGroups(this.studentFaculty.faculty_id).subscribe(values => {
                this.groups = values;
              })
            });
          });
        });
      });
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
      that.student.photo = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
  }
  //Відправляємо дані на сервер
  // handleSubmit() {
  //   let studentJSON = JSON.stringify({
  //     gradebook_id: this.student.gradebook_id,
  //     student_surname: this.student.student_surname,
  //     student_name: this.student.student_name,
  //     student_fname: this.student.student_fname,
  //     group_id: this.student.group_id,
  //     password: this.student.password,
  //     username: this.student.username,
  //     email: this.student.email,
  //     photo: this.student.photo,
  //     password_confirm: this.student.password,
  //     plain_password: this.student.password
  //   });
  //   this.service.addStudent(studentJSON).subscribe((data: IResponse) => {
  //     if (data.response === 'ok') {
  //       this.dialogRef.close();
  //     }
  //   });
  // }
}
