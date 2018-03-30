import { Component, OnInit, Input } from '@angular/core';
import { StudentsService } from '../students.service';
import { StudentAdd } from '../students-interface';

@Component({
  selector: 'app-student-registration-form',
  templateUrl: './student-registration-form.component.html',
  styleUrls: ['./student-registration-form.component.scss'],
  providers: [ StudentsService ]
})
export class StudentRegistrationFormComponent implements OnInit {

  title: string = "Студенти";

  constructor(private service: StudentsService) { }

  ngOnInit() {
  }

  addStudent() {
    let body: StudentAdd;
    this.service.addStudent(body);
  }

  getBack() {
  }

}
