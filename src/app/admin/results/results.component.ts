import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ResultsService } from "./services/results.service";

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
    this.resultService.getTests().subscribe((testData: any[]) => {
      this.tests = (testData && testData['response'] && testData['response'] === 'no records') ? [] : testData;
      if (this.tests.length > 0) {
        this.testId = this.tests[0].test_id;
        this.search();
      }
    });
    this.resultService.getGroups().subscribe((groupData: any[]) => {
      this.groups = (groupData.toString() === 'no records') ? [] : groupData;
    });
  }

  search() {
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
          let students = [];
          studentData.forEach(student => {
            let studentObj = {
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

  private initResultRecords(records: any[], students: any[]) {
    this.resultRecords = [];
    records.forEach(rec => {
      const record = {
        student_id: rec['student_id'],
        student_name: students.find(el => el.student_id === rec['student_id'])['student_name'],
        result: rec['result'],
        session_date: rec['session_date'],
        start_time: rec['start_time'],
        end_time: rec['end_time'],
        test_id: rec['test_id'],
        test_name: this.tests.find(el => el.test_id === rec['test_id']).test_name
      };
      this.resultRecords.push(record);
    });
  }
}
