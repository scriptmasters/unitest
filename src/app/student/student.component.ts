import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { TestPlayerService } from '../student/services/test-player.service';
import { StudentService } from './student.service';
import { UserInfo, TimeTable, Subject, TestInterface } from './test-player/question-interface';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  id: number;
  user = <UserInfo>{};
  timeTable = <TimeTable>{};
  time;
  subjects = [];
  constructor(
    public authService: AuthService,
    public studentService: StudentService
  ) { }

  ngOnInit() {
    this.authService.isLogged().subscribe((response: any) => {
      this.id = response.id;
      this.getRecords();
    });
  }
  getRecords() {
    this.studentService.getRecords(this.id).subscribe((responses: any) => {
      responses.forEach(item => {
        this.user.gradebook_id = item.gradebook_id;
        this.user.group_id = item.group_id;
        this.user.photo = item.photo;
        this.user.student_fname = item.student_fname;
        this.user.student_name = item.student_name;
        this.user.student_surname = item.student_surname;
        this.user.user_id = item.user_id;
        this.getRecordsGroup();
        this.getTimeTablesForGroup();
        this.user.ready = true;
      });
    });
  }
  getRecordsGroup() {
    this.studentService.getRecordsGroup(this.id).subscribe((response: any) => {
      response.forEach(item => {
        this.user.group_name = item.group_name;
        this.user.speciality_id = item.speciality_id;
        this.user.faculty_id = item.faculty_id;
        this.getRecordsSpeciality();
        this.getRecordsFaculty();
      });
    });
  }
  getRecordsSpeciality() {
    this.studentService.getRecordsSpeciality(this.user.speciality_id).subscribe((response: any) => {
      response.forEach(item => {
        this.user.speciality_code = item.speciality_code;
        this.user.speciality_name = item.speciality_name;
      });
    });
  }
  getRecordsFaculty() {
    this.studentService.getRecordsFaculty(this.user.faculty_id).subscribe((response: any) => {
      response.forEach(item => {
        this.user.faculty_name = item.faculty_name;
      });
    });
  }
  getTimeTablesForGroup() {
    this.studentService.getTimeTablesForGroup(this.user.group_id).subscribe((response: any) => {


      this.time = response;
      this.time.forEach(item => {
        this.studentService.getRecordsSubject(item.subject_id).
          subscribe((responses: any) => {

            const subject = <Subject>{};
            subject.tests = <TestInterface[]>[];
            subject.subject_name = responses.pop().subject_name;
            this.studentService.getTestsBySubject(item.subject_id)
              .subscribe((data: any) => {

                data.forEach(element => {
                  const test = <TestInterface>{};
                  test.test_name = element.test_name;
                  test.test_id = element.test_id;
                  test.tasks = element.tasks;
                  test.time_for_test = element.time_for_test;
                  test.enabled = element.enabled;
                  test.attempts = element.attempts;
                  subject.tests.push(test);
                });
                subject.ready = true;
              });

            this.subjects.push(subject);
          });
      });
      console.log(this.subjects);
    });
  }

  test(id) {

    const ids = id;
    this.studentService.getTestDetailsByTest(ids).subscribe((item: any) => {
      console.log(item);
    });
    // console.log(ids);
  }
}
