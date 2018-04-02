import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StudentGet } from './students-interface';
import { StudentAdd } from './students-interface';
import { GroupNameByID } from './students-interface';
import { Groups } from './students-interface';
import { Faculties } from './students-interface';
import { Student } from './students-interface'
import { IResponse } from './students-interface';

@Injectable()
export class StudentsService {

  getStudentsURL: string = 'http://vps9615.hyperhost.name:443/api/Student/getRecordsRange/20/0';
  addStudentURL: string = 'http://vps9615.hyperhost.name:443/api/Student/insertData';
  getFacultiesURL: string = 'http://vps9615.hyperhost.name:443/api/Faculty/getRecords';
  getEntityValueURL: string = 'http://vps9615.hyperhost.name:443/api/EntityManager/getEntityValues';
  title: string = 'Студенти';
  students: Student[] = [];
  constructor(private http: HttpClient) { }


  getStudents(): Observable<StudentGet[]> {
    return this.http.get<StudentGet[]>(this.getStudentsURL);
  }

  getEntityValue(body): Observable<GroupNameByID[]> {
    return this.http.post<GroupNameByID[]>(this.getEntityValueURL, body);
  }

  addStudent(body): Observable<StudentAdd|IResponse> {
    return this.http.post<StudentAdd|IResponse>(this.addStudentURL, body);
  } 

  getAvailableGroups(value): Observable<Groups[]> {
    return this.http.get<Groups[]>(`http://vps9615.hyperhost.name/api/group/getGroupsByFaculty/${value}`);
  }

  getAvailableFaculties(): Observable<Faculties[]> {
    return this.http.get<Faculties[]>(this.getFacultiesURL);
  }

  // метод який записує в масив "students" дані про кожного студента
  fillOutStudentsTable() {
    this.getStudents().subscribe(data => {
      let groupsArr = [];
      for (let i = 0; i < data.length; i++) {
        groupsArr.push(data[i].group_id);
      }
      let body = JSON.stringify({entity: "Group", ids: groupsArr});
      this.getEntityValue(body).subscribe(response => {
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
