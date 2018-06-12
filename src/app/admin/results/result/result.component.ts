import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ResultsService} from '../services/results.service';
import * as moment from 'moment';
import {Pagination} from '../../../shared/pagination/pagination.class';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginatorIntl, MatSnackBar} from '@angular/material';
import {PaginationService} from '../../../shared/pagination/pagination.service';
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {TestResultGraphComponent} from '../modals/test-result-graph/test-result-graph.component';

@Component({
  selector: 'app-filtered-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent extends Pagination implements OnInit, OnDestroy {
  @Input() groups = [];
  @Input() groupId: number;
  @Input() testId: number;
  @Input() tests = [];
  @Input() showResult: boolean;
  @Output() filterEmit = new EventEmitter<boolean>();

  order: string;
  resultRecords = [];
  showNoDataBlock = false;
  testName: string;

  private orderTypes = ['student', 'studentDesc',
                        'result', 'resultDesc',
                        'quality', 'qualityDesc',
                        'date' , 'dateDesc',
                        'duration', 'durationDesc'];

  constructor(private resultService: ResultsService,
              public router: Router,
              public route: ActivatedRoute,
              public pagIntl: MatPaginatorIntl,
              public http: HttpClient,
              public dialog: MatDialog,
              public pagService: PaginationService,
              public snackBar: MatSnackBar,
              public translate: TranslateService) {
      super(router, route, pagIntl, http, dialog, pagService, snackBar);
  }

  ngOnInit () {
    this.initLogic(true);
    this.pageSize = 5;
    this.order = 'student';
  }

  ngOnDestroy () {
    this.destroyLogic();
  }

  showFilter() {
    this.filterEmit.emit(true);
  }

  search() {
    this.showNoDataBlock = false;
    if (this.testId) {
      this.initTestName();

      this.resultService.getTestRecordsByParams(this.testId, this.groupId).subscribe((records: any[]) => {
        if (records['response'] === 'no records') {
          this.resultRecords = [];
          this.showNoDataBlock = true;
        } else {
          let studentIds: number[] = [];
          records.forEach(el => {
            studentIds.push(el.student_id);
          });
          studentIds = Array.from(new Set(studentIds));
          this.resultService.getStudents(studentIds).subscribe((studentData: any[]) => {
            const students = [];
            studentData.forEach(student => {
              const studentObj = {
                student_name: `${student['student_surname']} ${student['student_name']} ${student['student_fname']}`,
                student_id: student['user_id'],
                group_id: student['group_id']
              };
              students.push(studentObj);
            });
            this.initResultRecords(records, students);
            this.sortItems();
          });
        }
      });
    }
  }
  setOrder(orderType: string) {
    this.order = orderType;
    this.sortItems();
  }

  sortItems() {
    if (this.order) {
      switch (this.order) {
        case 'student': {
          this.resultRecords.sort((a, b) => a.student_name.localeCompare(b.student_name));
          break;
        }
        case 'studentDesc': {
          this.resultRecords.sort((a, b) => b.student_name.localeCompare(a.student_name));
          break;
        }
        case 'result': {
          this.resultRecords.sort((a, b) => a.result - b.result);
          break;
        }
        case 'resultDesc': {
          this.resultRecords.sort((a, b) => b.result - a.result);
          break;
        }
        case 'quality': {
          this.resultRecords.sort((a, b) => {
            return parseInt(a.quality, 10) - parseInt(b.quality, 10);
          });
          break;
        }
        case 'qualityDesc': {
          this.resultRecords.sort((a, b) => {
            return parseInt(b.quality, 10) - parseInt(a.quality, 10);
          });
          break;
        }
        case 'date': {
          this.resultRecords.sort((a, b) => {
            const dateA = new Date(a.session_date);
            const dateB = new Date(b.session_date);
            return dateA.getTime() - dateB.getTime();
          });
          break;
        }
        case 'dateDesc': {
          this.resultRecords.sort((a, b) => {
            const dateA = new Date(a.session_date);
            const dateB = new Date(b.session_date);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        }
        case 'duration': {
          this.resultRecords.sort((a, b) => {
            const dateA = Number(a.duration.split(':')[0]) * 3600 +
                          Number(a.duration.split(':')[1]) * 60 +
                          Number(a.duration.split(':')[2]);
            const dateB = Number(b.duration.split(':')[0]) * 3600 +
                          Number(b.duration.split(':')[1]) * 60 +
                          Number(b.duration.split(':')[2]);
            return dateA - dateB;
          });
          break;
        }
        case 'durationDesc': {
          this.resultRecords.sort((a, b) => {
            const dateA = Number(a.duration.split(':')[0]) * 3600 +
                          Number(a.duration.split(':')[1]) * 60 +
                          Number(a.duration.split(':')[2]);
            const dateB = Number(b.duration.split(':')[0]) * 3600 +
                          Number(b.duration.split(':')[1]) * 60 +
                          Number(b.duration.split(':')[2]);
            return dateB - dateA;
          });
          break;
        }
        case 'time': {
          this.resultRecords.sort((a, b) => {
            const dateA = Number(a.time.split(':')[0]) * 3600 +
              Number(a.time.split(':')[1]) * 60 +
              Number(a.time.split(':')[2]);
            const dateB = Number(b.time.split(':')[0]) * 3600 +
              Number(b.time.split(':')[1]) * 60 +
              Number(b.time.split(':')[2]);
            return dateB - dateA;
          });
          break;
        }
        case 'timeDesc': {
          this.resultRecords.sort((a, b) => {
            const dateA = Number(a.time.split(':')[0]) * 3600 +
              Number(a.time.split(':')[1]) * 60 +
              Number(a.time.split(':')[2]);
            const dateB = Number(b.time.split(':')[0]) * 3600 +
              Number(b.time.split(':')[1]) * 60 +
              Number(b.time.split(':')[2]);
            return dateA - dateB;
          });
          break;
        }
      }
    }
  }

  openChartDialog() {
    this.dialog.open(TestResultGraphComponent, {
      disableClose: true,
      width: '75%',
      data: this.resultRecords
    });
  }

  private initResultRecords(records: any[], students: any[]) {
    this.resultRecords = [];
    records.forEach(rec => {
      const record = {
        student_id: rec['student_id'],
        student_name: students.find(el => el.student_id === rec['student_id'])['student_name'],
        result: rec['result'],
        session_date: rec['session_date'],
        time: rec['start_time'],
        duration: this.getDuration(rec['start_time'], rec['end_time']),
        quality: this.getQuality(rec['result'], rec['answers']),
        start_time: rec['start_time'],
        end_time: rec['end_time'],
        test_id: rec['test_id'],
        test_name: this.tests.find(el => el.test_id === rec['test_id']).test_name
      };
      this.resultRecords.push(record);
    });
  }

  private getDuration(startTime: string, endTime: string): string {
    const startDate = new Date();
    const endDate = new Date();
    const startTimeHours: number[] = startTime.split(':').map((x: string) => Number(x));
    startDate.setHours(startTimeHours[0], startTimeHours[1], startTimeHours[2]);
    const endTimeHours: number[] = endTime.split(':').map((x: string) => Number(x));
    endDate.setHours(endTimeHours[0], endTimeHours[1], endTimeHours[2]);

    return moment.utc(endDate.getTime() - startDate.getTime()).format('HH:mm:ss');
  }

  private getQuality(result: number, maxRate: number): string {
    return Math.round(result / maxRate * 100) + '%';
  }

  private initTestName(): void {
    const testItem = this.tests.find(x  => x.test_id === this.testId);
    if (testItem) {
      this.testName = testItem.test_name;
    }
  }
}
