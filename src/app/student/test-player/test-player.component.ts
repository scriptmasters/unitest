import { Component, HostListener, OnInit } from '@angular/core';
import { TestPlayerService } from '../services/test-player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ITimeStamp } from './interfaces/TimeStamp';
import { ITimer } from './interfaces/Timer';
import { TimerService } from '../services/timer.service';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../services/data.service';
import { IQuestion } from './interfaces/Question';
import { IStudent } from './interfaces/Student';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.scss'],
})
export class TestPlayerComponent implements OnInit {
  questions;
  userAnswers = {};
  userCheckboxAnswers = {}; // for checkbox question
  checkboxAnswersStatus = {};
  question: IQuestion;
  isLoaded = false;
  Index = 1;

  // ******** TIMER ************

  time: ITimeStamp = {
    unix_timestamp: 0,
    offset: 0,
    curtime: 0,
  };
  startDate: any;
  endDate: any;
  distance: number;
  timer: ITimer = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  studentId: number;
  timeOfTest: number;
  nameOfTest: string;
  start: any;
  student: IStudent = {
    user_id: 0,
    gradebook_id: '',
    student_surname: '',
    student_name: '',
    student_fname: '',
    group_id: 0,
    photo: '',
  };

constructor(private testPlayerService: TestPlayerService,
              private questionService: QuestionService,
              private timerService: TimerService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private authService: AuthService,
              private data: DataService) {
    this.start = setInterval(() => {
      this.timerActions();
    }, 1000);
  }


  ngOnInit() {
    this.getQuestions();

    this.getTime();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler($event) {
    $event.returnValue = true;
  }

  getQuestions(): void {
    this.questions = this.questionService.getQuestions();
    if (this.questions !== null) {
      this.question = this.questions[0];
      this.isLoaded = true;
    }
  }

  sendAnswers(question, answer) {
    // for checkbox questions
    if (+question.type === 2) {
      this.userCheckboxAnswers[question.question_id] =
        this.userCheckboxAnswers[question.question_id] || {};
      const topModel = this.userCheckboxAnswers[question.question_id];
      topModel[answer.answer_id] = !topModel[answer.answer_id];
      const answersArr = [];
      let answers_ids = '';

      this.checkboxAnswersStatus[answer.answer_id] = !this.checkboxAnswersStatus[answer.answer_id];

      for (const key in topModel) {
        if (topModel[key] === false) {
          delete topModel[key];
        } else {
          answersArr.push(key);
          answers_ids = answersArr.join(' ');
        }
      }

      this.userAnswers[question.question_id] =
        this.userAnswers[question.question_id] || {};
      this.userAnswers[question.question_id].question_id = question.question_id;
      this.userAnswers[question.question_id].answer_id = answers_ids;

      // for input questions
    } else if (+question.type === 3 || +question.type === 4) {
      this.userAnswers[question.question_id] =
        this.userAnswers[question.question_id] || {};
      this.userAnswers[question.question_id] = question;
      this.userAnswers[question.question_id].answer_id = answer;
    }
  }

  finishTest() {
    this.timerService
      .clearTime()
      .subscribe(response => console.log(response));
    this.testPlayerService
      .checkResult(this.userAnswers)
      .subscribe((response: any) => {
        this.data.setAnswers(response.number_of_true_answers);
        this.data.setMark(response.full_mark);
        this.data.setCountOfQuestions(this.questions.length);
        this.router.navigate(['student/results']);
      });
    window.localStorage.clear();
  }

  // Questions routing
  questionRoute(index) {
    this.Index = index + 1;
    this.question = this.questions[index];
    // console.log(this.questions);
    // console.log(this.userAnswers);
    // console.log(this.question);
  }

  nextQuestion() {
    this.Index++;
    if (this.Index > this.questions.length) {
      this.Index = 1;
    }
    this.question = this.questions[this.Index - 1];
  }

  prevQuestion() {
    this.Index--;
    if (this.Index < 1) {
      this.Index = this.questions.length;
    }
    this.question = this.questions[this.Index - 1];
  }

  //  ************ TIMER ******************
  timerActions() {
    this.timer.hours = Math.floor(this.distance / (1000 * 60 * 60));
    this.timer.minutes = Math.floor(
      (this.distance % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (parseInt(this.timer.minutes, 10) < 10) {
      this.timer.minutes = '0' + this.timer.minutes;
    }

    this.timer.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
    if (parseInt(this.timer.seconds, 10) < 10) {
      this.timer.seconds = '0' + this.timer.seconds;
    }

    this.distance -= 1000;

    if (this.distance <= -1) {
      this.timer.hours = '00';
      this.timer.minutes = '00';
      this.timer.seconds = '00';
      this.timerService
        .clearTime()
        .subscribe(response => console.log(response));
      clearInterval(this.start);
      this.finishTest();
      // alert('time\'s up');
    }
  }

  getTime() {
    // Беремо Час для тесту і Subject_id
    this.route.params.subscribe(params => {
      this.timerService.getTest(params['id']).subscribe(test => {
        this.timeOfTest = test[0].time_for_test * 60 * 1000;
        this.nameOfTest = test[0].test_name;
        this.getEndTimeOfTest(test[0].subject_id);
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
          this.student = data;
        });
      });
    });
  }

  // Рахуємо скільки часу залишилось
  countTimeLeft() {
    // Get current time
    this.timerService.getTimeStamp().subscribe(timeBegin => {
      this.time.curtime = timeBegin.unix_timestamp * 1000;
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
        this.timerService
          .saveEndTime({
            end: this.startDate + this.distance,
          })
          .subscribe(
            response => {
            },
            error => {
              console.error(error.error.response);
            }
          );
        this.timeSlot();
      } else {
        this.distance = endOfTest.end - this.startDate;
        if (this.distance > this.endDate - this.startDate) {
          this.distance = this.endDate - this.startDate;
        }
        if (this.distance === undefined) {
          this.timerService
            .clearTime()
            .subscribe(response => console.log(response));
        }
      }
    });
  }
}
