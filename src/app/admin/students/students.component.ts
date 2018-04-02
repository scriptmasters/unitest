import { Component, OnInit } from '@angular/core';
import { StudentsService } from './students.service';
import { StudentGet } from './students-interface';
import { Student } from './students-interface';
import { group } from '@angular/animations';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [ StudentsService ]
})
export class StudentsComponent implements OnInit {

  title: string = 'Студенти';
  students: Student[] = [];

  constructor(private service: StudentsService) { }

  ngOnInit() {
    //При кожному ререндері компоненту будуть братись нові дані з сервера
    this.service.fillOutStudentsTable();
    this.students = this.service.students;
  }

}
