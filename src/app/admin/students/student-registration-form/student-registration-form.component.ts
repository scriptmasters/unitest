import { Component, OnInit, Input } from '@angular/core';
import { StudentsService } from '../students.service';
import { StudentAdd } from '../students-interface';
import { Groups } from '../students-interface';
import { Faculties } from '../students-interface';

@Component({
  selector: 'app-student-registration-form',
  templateUrl: './student-registration-form.component.html',
  styleUrls: ['./student-registration-form.component.scss'],
  providers: [ StudentsService ]
})
export class StudentRegistrationFormComponent implements OnInit {

  title: string = "Студенти";
  groups: Groups[] = [];
  faculties: Faculties[] = [];

  constructor(private service: StudentsService) { }

  ngOnInit() {
    this.service.getAvailableFaculties().subscribe(response => {
      this.faculties = response;
      this.service.getAvailableGroups('1').subscribe(data => this.groups = data);
    });
  }

  addStudent() {
    let body: StudentAdd;
    this.service.addStudent(body);
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
      } else {
        this.groups = [{
          group_id: 'none',
          group_name: 'Немає зареєстрованих груп для вашого факультету',
          speciality_id: 'none',
          faculty_id: 'none'
        }]
      }
  });
  }

}
