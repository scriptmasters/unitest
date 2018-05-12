import {Component, OnInit} from '@angular/core';

import {TestPlayerService} from '../services/test-player.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {TestResultComponent} from './test-result/test-result.component';
import {ITimeStamp} from './interfaces/TimeStamp';
import {ITimer} from './interfaces/Timer';
import {TimerService} from '../services/timer.service';
import {AuthService} from '../../auth/auth.service';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.scss'],
})
export class TestPlayerComponent implements OnInit {
  questions = [];
  userAnswers = {};
  userCheckboxAnswers = {}; // for checkbox question

  // ******** TIMER ************

  time: ITimeStamp = {
    unix_timestamp: 0,
    offset: 0,
    curtime: 0
  };
  startDate: any;
  endDate: any;
  distance: number;
  timer: ITimer = {
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  studentId: number;
  timeOfTest: number;
  start: any;

  constructor(private testPlayerService: TestPlayerService,
              private timerService: TimerService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private authService: AuthService,
              private data: DataService) {

    this.start = setInterval(() => {

      this.timer.hours = Math.floor(this.distance / (1000 * 60 * 60));
      this.timer.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));

      if (parseInt(this.timer.minutes, 10) < 10) {
        this.timer.minutes = '0' + this.timer.minutes;
      }

      this.timer.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
      if (parseInt(this.timer.seconds, 10) < 10) {
        this.timer.seconds = '0' + this.timer.seconds;
      }

      this.distance -= 1000;

      if (this.distance <= -1) {
        this.router.navigate(['/student'], {relativeTo: this.route});
        this.timer.hours = 0;
        this.timer.minutes = '00';
        this.timer.seconds = '00';
        this.timerService.clearTime().subscribe(response => console.log(response));
        clearInterval(this.start);
        // alert('time\'s up');
      }
    }, 1000);
  }

  ngOnInit() {
    this.getQuestionsForTest();
    this.getTime();
  }

  getQuestionsForTest(): void {
    const testId = +this.route.snapshot.paramMap.get('id');
    this.testPlayerService
      .getQuestionsWithAnswers(testId)
      .subscribe((questions: any) => {
        this.questions = questions;
      });
  }

  selectedAnswer(question, answer) {
    this.userCheckboxAnswers[question.question_id] =
      this.userCheckboxAnswers[question.question_id] || {};
    const topModel = this.userCheckboxAnswers[question.question_id];
    topModel[answer.answer_id] = !topModel[answer.answer_id];
    const answersArr = [];
    let answers_ids = '';
    for (const key in topModel) {
      if (topModel[key] === false) {
        delete topModel[key];
      } else {
        answersArr.push(key);
        answers_ids = answersArr.join(',');
      }
    }

    this.userAnswers[question.question_id] =
      this.userAnswers[question.question_id] || {};
    this.userAnswers[question.question_id].question_id = question.question_id;
    this.userAnswers[question.question_id].answer_id = answers_ids;
  }

  openModal(testResult): void {
    const matDialogRef = this.dialog.open(TestResultComponent, {
      disableClose: true,
      width: '400px',
      data: {result: testResult},
    });

    matDialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['student']);
    });
  }

  finishTest() {
    console.log('Finish Test');
    this.testPlayerService
      .checkResult(this.userAnswers)
      .subscribe((response: any) => {
        const testResult = response;
        this.data.setAnswers(response.number_of_true_answers);
        this.data.setMark(response.full_mark);
       // this.openModal(testResult);
       this.router.navigate(['student/results']);
      });
  }


//  ************ TIMER ******************
  getTime() {
    // Беремо Час для тесту і Subject_id
    this.route.params.subscribe(params => {
      this.timerService.getTest(params['id']).subscribe(testTime => {
        this.timeOfTest = testTime[0].time_for_test * 60 * 1000;
        this.getEndTimeOfTest(testTime[0].subject_id);
      });
    });
  }

// З TimeTable Беремо час закінчення тесту по GroupId and SubjectId
  getEndTimeOfTest(idSubj) {
    this.authService.isLogged().subscribe((response: any) => {
      this.studentId = response.id;
      this.timerService.getStudentRecords(this.studentId).subscribe(data => {
        this.timerService.getStudentTimetable(data[0].group_id, idSubj).subscribe(time => {
          this.countTimeLeft();
        });
      });
    });
  }

// Рахуємо скільки часу залишилось
  countTimeLeft() {
    // Get current time
    this.timerService.getTimeStamp().subscribe(timeBegin => {
      this.time.curtime = timeBegin.curtime * 1000;
      // Translate Dates to milliseconds
      this.startDate = new Date(this.time.curtime).getTime();
      this.endDate = this.startDate + this.timeOfTest;
      this.distance = this.endDate - this.startDate;

      // Save EndTime of the test at Server. Get EndTime from server and check if enough time to pass the test
      this.timeSlot();
    });
  }

  timeSlot() {
    this.timerService.getEndTime().subscribe(endOfTest => {
      if (endOfTest.response === 'Empty slot') {
        this.timerService.saveEndTime({
          'end': (this.startDate + this.distance)
        }).subscribe((response) => {
        }, error => {
          console.error(error.error.response);
        });
        this.timeSlot();
      } else {
        this.distance = endOfTest.end - this.startDate;
        if (this.distance > (this.endDate - this.startDate)) {
          this.distance = this.endDate - this.startDate;
        }
        if (this.distance === undefined) {
          this.timerService.clearTime().subscribe(response => console.log(response));
        }
      }
    });
  }

  Back() {
    this.router.navigate(['/student'], {relativeTo: this.route});
  }

  stopTimer() {
    this.timerService.clearTime().subscribe(response => {
      console.log(response);
      this.timerService.saveEndTime({
        'end': (this.startDate + 1000)
      });
      clearInterval(this.start);
    });
  }


// End of component
}
