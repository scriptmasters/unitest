import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultsService } from './services/results.service';
import * as moment from 'moment';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  testId: number;
  groupId: number;

  tests = [];
  groups = [];
  resultRecords = [];

  constructor(
    private route: ActivatedRoute,
    private resultService: ResultsService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const groupIdParam = params['groupId'];
      if (groupIdParam) {
        this.groupId = groupIdParam;
      }
    });
    this.resultService.getTests().subscribe((testData: any[]) => {
      this.tests = (testData['response'] === 'no records') ? [] : testData;

      this.resultService.getGroups().subscribe((groupData: any[]) => {
        this.groups = (groupData['response'] === 'no records') ? [] : groupData;
        if (this.groupId && this.tests.length > 0) {
          this.testId = this.tests[0].test_id;
          this.search();
        } else {
        }
      });
    });
  }

  search() {
    if (this.testId) {
      this.resultService.getTestRecordsByParams(this.testId, this.groupId).subscribe((records: any[]) => {
        if (records && records['response'] && records['response'] === 'no records') {
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
        quality: '75%', // todo remove hardcoded value, use pipe
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
}
