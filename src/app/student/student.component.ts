import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {TestPlayerService} from './services/test-player.service';
import {StudentService} from './student.service';
import {Subject, TestInterface, TimeTable, UserInfo} from './test-player/question-interface';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {ResponseMessageComponent} from '../shared/response-message/response-message.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  id: number;
  user = <UserInfo>{};
  subjects = [];
  error;
  allSubjectsReady = false;
  filteredSubjects = [];
  constructor(
    public authService: AuthService,
    public studentService: StudentService,
    private testPlayerService: TestPlayerService,
    private router: Router,
    public dialog: MatDialog
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
    this.studentService
      .getRecordsGroup(this.user.group_id)
      .subscribe((response: any) => {
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
    this.studentService
      .getRecordsSpeciality(this.user.speciality_id)
      .subscribe((response: any) => {
        response.forEach(item => {
          this.user.speciality_code = item.speciality_code;
          this.user.speciality_name = item.speciality_name;
        });
      });
  }

  getRecordsFaculty() {
    this.studentService
      .getRecordsFaculty(this.user.faculty_id)
      .subscribe((response: any) => {
        response.forEach(item => {
          this.user.faculty_name = item.faculty_name;
        });
      });
  }

  getTimeTablesForGroup() {
    this.subjects.length = 0;
    this.studentService
      .getTimeTablesForGroup(this.user.group_id)
      .subscribe((response: any) => {
        response.forEach(element => {
          const timeTables = <TimeTable>{};
          timeTables.end_date = moment(element.end_date).format('l');
          timeTables.end_time = moment(element.end_time, 'HH:mm:ss').format(
            'LT'
          );
          timeTables.start_date = moment(element.start_date).format('l');
          timeTables.start_time = moment(element.start_time, 'HH:mm:ss').format(
            'LT'
          );
          timeTables.subject = <Subject[]>[];

          this.studentService
            .getRecordsSubject(element.subject_id)
            .subscribe((responses: any) => {
              const subject = <Subject>{};
              subject.tests = <TestInterface[]>[];
              subject.subject_name = responses.pop().subject_name;

              this.studentService
                .getTestsBySubject(element.subject_id)
                .subscribe((data: any) => {
                  data.forEach(testResponse => {
                    const test = <TestInterface>{};
                    test.test_name = testResponse.test_name;
                    test.test_id = testResponse.test_id;
                    test.tasks = testResponse.tasks;
                    test.time_for_test = testResponse.time_for_test;
                    test.enabled = testResponse.enabled;
                    test.attempts = testResponse.attempts;
                    subject.tests.push(test);
                  });
                  subject.ready = true;
                });

              timeTables.subject.push(subject);
              this.subjects.push(timeTables);
              this.filteredSubjects.push(timeTables);
            });
        });
      });
  }

  startTest(studentId, testId): void {
    this.testPlayerService.startTest(studentId, testId).subscribe(
      (data: any) => {
        alert(data.response);
        if (data.response === 'Error. User made test recently') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Ви здавали тест нещодавно, почекайте 10 хв'
            }
          });
        } else if (data.response === 'Not enough number of questions for quiz') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Замало тестів'
            }
          });
        } else if (data.response === 'ok') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Тест почався'
            }
          });
          this.router.navigate(['student/test/' + testId]);
        }
      },
      error => {
        alert('erro' + error.error.response);
        if (error.error.response === 'You cannot make the test due to your schedule') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Тест недоступний по часу'
            }
          });
        } else if (error.error.response === 'You cannot call this method without making an quiz') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Неможите запустити цей тест тестів'
            }
          });
        } else if (error.error.response === 'Not enough number of questions for quiz') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Замало тестів'
            }
          });
        } else if (error.error.response === 'User is making test at current moment') {
          // this.dialog.open(ResponseMessageComponent, {
          //   width: '400px',
          //   data: {
          //     message: 'Ви здаєте тест в даний момент'
          //   }
          // });
          this.router.navigate(['student/test/' + testId]);
        } else if (error.error.response === 'You cannot make the test due to used all attempts') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Ви використали всі спроби'
            }
          });
        } else if (error.error.response === 'You can start tests which are only for you!!!') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Ви можете почати тести, які тільки для вас !!!'
            }
          });
        }
      }
    );
  }
  getAllSubjects() {
    this.filteredSubjects.length = 0;
    this.subjects.forEach(item => {
      this.filteredSubjects.push(item);
    });
  }
  getTime(id, includeDay) {
    const day = id;
    this.studentService.getTime().subscribe(
      (time: any) => {
        const _time = moment.utc(time.unix_timestamp * 1000);
        const b = _time;
        this.filteredSubjects.length = 0;
        this.subjects.forEach(item => {
          const timesTable = moment.utc(item.end_date);
          const a = timesTable.diff(_time);
          const c = moment(a).format('D');
          console.log(c);
          if (includeDay) {
            if ((+c) === day) {
              this.filteredSubjects.push(item);
            }
          } else {
            if (c <= day) {
              this.filteredSubjects.push(item);
            }
          }
          console.log(this.subjects);
        });
      });
  }

}
