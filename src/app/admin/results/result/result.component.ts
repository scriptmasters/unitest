import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ResultsService} from '../services/results.service';
import * as moment from 'moment';
import {Pagination} from '../../../shared/pagination/pagination.class';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginatorIntl, MatSnackBar} from '@angular/material';
import {PaginationService} from '../../../shared/pagination/pagination.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-filtered-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent extends Pagination implements OnInit, OnDestroy {
  @Input() groups = [];
  @Input() groupId: number;
  @Input() order: string;
  @Input() testId: number;
  @Input() tests = [];
  @Input() showResult: boolean;
  @Output() filterEmit = new EventEmitter<boolean>();

  resultRecords = [];
  testMaxRate: number;

  constructor(private resultService: ResultsService,
              public router: Router,
              public route: ActivatedRoute,
              public pagIntl: MatPaginatorIntl,
              public http: HttpClient,
              public dialog: MatDialog,
              public pagService: PaginationService,
              public snackBar: MatSnackBar) {
      super(router, route, pagIntl, http, dialog, pagService, snackBar);
  }

  ngOnInit () {
    this.initLogic(true);
    this.pageSize = 5;
  }

  ngOnDestroy () {
    this.destroyLogic();
  }

  showFilter() {
    this.filterEmit.emit(true);
  }

  search() {
    this.resultService.getMaxTestRate(this.testId).subscribe((resp: any) => {
      this.testMaxRate = resp.testRate;
    });

    if (this.testId) {
      this.resultService.getTestRecordsByParams(this.testId, this.groupId).subscribe((records: any[]) => {
        if (records['response'] === 'no records') {
          this.resultRecords = [];
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
            if (this.order) {
              switch (this.order) {
                case 'date': {
                  this.resultRecords.sort((a, b) => {
                    const dateA = new Date(a.session_date);
                    const dateB = new Date(b.session_date);
                    return dateA.getTime() - dateB.getTime();
                  });
                  break;
                }
                case 'rate': {
                  this.resultRecords.sort((a, b) => a.result - b.result);
                  break;
                }
                case 'userName': {
                  this.resultRecords.sort((a, b) => {
                    if (a.student_name < b.student_name) { return -1; }
                    if (a.student_name > b.student_name) { return 1; }
                    return 0;
                  });
                  break;
                }
              }
            }
          });
        }
      });
    }
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
        quality: this.getQuality(rec['result'], this.testMaxRate),
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
}
