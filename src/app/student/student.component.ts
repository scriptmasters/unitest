import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { TestPlayerService } from '../student/services/test-player.service';
import { StudentService } from './student.service';
import { UserInfo, TimeTable, Subject, TestInterface } from './test-player/question-interface';
import { NgStyle } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import * as moment from 'moment';
import { QuestionService } from './services/question.service';
import { ResponseMessageComponent } from '../shared/response-message/response-message.component';
import { MatDialog } from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import { DataService } from './services/data.service';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  id: number;
  user = <UserInfo>{};
  time;
  subjects = [];
  times = [];
  error;
  allSubjectsReady = false;
  filteredSubjects = [];
  infoTestId;
  infoTestName;
  progresstest;
  localIdTets;
  localNameTest;
  constructor(
    public authService: AuthService,
    public studentService: StudentService,
    private testPlayerService: TestPlayerService,
    private questionService: QuestionService,
    private router: Router,
    public dialog: MatDialog, public translate: TranslateService,
    public data: DataService) {
    if (data.getLang() === null) {
      data.setLang('uk');
    } else {
      data.setLang(data.getLang());
    }
  }

  ngOnInit() {
    this.localNameTest = JSON.parse(localStorage.getItem('testName'));
    this.localIdTets = JSON.parse(localStorage.getItem('testId'));
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
        if (data.response === 'ok') {
          this.translate.get('TEST.START').subscribe(msg => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: msg,
              },
            });
          });
          this.studentService.getRecordsTest(testId).subscribe((infoTest: any) => {
            infoTest.forEach((test: any) => {
              localStorage.setItem('testId', JSON.stringify(test.test_id));
              localStorage.setItem('testName', JSON.stringify(test.test_name));
            });
          });
          this.studentService.saveInfoTest(testId).subscribe((infos: any) => {
          });
          this.testPlayerService
            .getQuestionsWithAnswers(testId)
            .subscribe((questions: any) => {
              this.questionService.setQuestions(questions);
              this.router.navigate(['student/test/' + testId]);
            });
        }
      },
      error => {
        if (
          error.error.response ===
          'You cannot make the test due to your schedule'
        ) {
          this.translate.get('STUD.TP.CD').subscribe(m => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: m,
              },
            });
          });
        } else if (
          error.error.response ===
          'Error: The number of needed questions for the quiz is not suitable due to test details'
        ) {
          this.translate.get('STUD.TP.WA').subscribe(me => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: me,
              },
            });
          });
        } else if (error.error.response === 'You cannot call this method without making an quiz') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Неможливо запустити цей тест'
            }
          });
        } else if (
          error.error.response === 'Not enough number of questions for quiz'
        ) {
          this.translate.get('STUD.TP.NET').subscribe(q => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: q,
              },
            });
          });
        } else if (
          error.error.response === 'User is making test at current moment'
        ) {
          this.localIdTets = JSON.parse(localStorage.getItem('testId'));
            if ((+this.localIdTets) === (+testId)) {
              this.router.navigate(['student/test/' + testId]);
            } else {
              this.translate.get('STUD.TP.PASSING').subscribe(messaga => {
                this.dialog.open(ResponseMessageComponent, {
                  width: '400px',
                  data: {
                    message: messaga,
                  },
                });
              });
            }
        } else if (
          error.error.response ===
          'You cannot make the test due to used all attempts'
        ) {
          this.translate.get('STUD.TP.ATT').subscribe(a => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: a,
              },
            });
          });
        } else if (error.error.response === 'You can start tests which are only for you!!!') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Ви можете почати тести, які тільки для вас !!!'
            }
          });
        } else if (
          error.error.response ===
          'Error: The number of needed questions for the quiz is not suitable due to test details'
        ) {
          this.translate.get('TP.Q').subscribe(tpq => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: tpq,
              },
            });
          });
        } else if (
          error.error.response ===
          'Test detail parameters not found for requested test'
        ) {
          this.translate.get('TDNF').subscribe(tdnf => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message:
                  tdnf,
              },
            });
          });
        } else if (error.error.response === 'Error. User made test recently') {
          this.translate.get('STUD.TP.WAIT').subscribe(wait => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: wait,
              },
            });
          });
        } else if (
          error.error.response === 'Not enough number of questions for quiz'
        ) {
          this.translate.get('STUD.TP.NET').subscribe(k => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: k,
              },
            });
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
        this.filteredSubjects.length = 0;
        this.subjects.forEach(item => {
          const timesTable = moment.utc(item.end_date);
          const diff = timesTable.diff(_time);
          const times = moment(diff).format('D');
          if (includeDay) {
            if ((+times) === day) {
              this.filteredSubjects.push(item);
            }
          } else {
            if (times <= day) {
              this.filteredSubjects.push(item);
            }
          }
        });
      });
  }
  crossTest(id) {
    this.router.navigate(['student/test/' + id]);
  }
  currentTestColor(id) {
    return id === this.localIdTets ? true : false;
  }
}
