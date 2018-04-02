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
    this.fillOutStudentsTable();
  }

  // метод який записує в масив "students" дані про кожного студента
  fillOutStudentsTable() {
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
        // Додавання студентів в масив "students"
        for (let i = 0; i < data.length; i++) {
          this.students.push({
            student_fname: data[i].student_fname,
            student_name: data[i].student_name,
            student_surname: data[i].student_surname,
            gradebook_id: data[i].gradebook_id,
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

}
