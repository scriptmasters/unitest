import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StudentsService } from '../students.service';

import { StudentAdd } from '../students-interface';
import { Groups } from '../students-interface';
import { Faculties } from '../students-interface';
import { defaultImage } from './default-image'
import { IResponse } from '../students-interface';

@Component({
  selector: 'app-student-registration-form',
  templateUrl: './student-registration-form.component.html',
  styleUrls: ['./student-registration-form.component.scss'],
  providers: [ StudentsService ]
})
export class StudentRegistrationFormComponent implements OnInit {

  groups: Groups[] = [];
  faculties: Faculties[] = [];
  //Властивості, які вибираються з інпутів
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
  @Output() onChanged = new EventEmitter();

  constructor(private service: StudentsService) { }

  ngOnInit() {
    this.service.getAvailableFaculties().subscribe(response => {
      this.faculties = response;
      this.service.getAvailableGroups('1').subscribe(data => {
        this.groups = data;
        this.student.group_id = this.groups[0].group_id;
      });
    });
  }

  getGroups(elem: HTMLSelectElement) {
    let value = elem.options[elem.selectedIndex].value;
    let index: string;
    this.faculties.forEach(val => {
      if(val.faculty_name === value) {
        index = val.faculty_id;
      }
    })
    this.service.getAvailableGroups(index).subscribe(data => {
      if (data[0]) {
        this.groups = data;
        this.student.group_id = this.groups[0].group_id;
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
        this.onChanged.emit();
      } else {
        alert("Йой, курва, щось пішло не так :(");
      }
    });
  }
}
