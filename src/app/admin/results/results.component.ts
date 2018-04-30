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

  constructor(
    private route: ActivatedRoute,
    private resultService: ResultsService
  ) { }

  ngOnInit() {
    this.resultService.getTests().subscribe((testData : any[]) => {
      this.tests = (testData.toString() === "no records") ? [] : testData;
      if(this.tests.length > 0) {
        this.testId = this.tests[0].test_id;
      }
    });
    this.resultService.getGroups().subscribe((groupData: any[])=> {
      this.groups = (groupData.toString() === "no records") ? [] : groupData;
    });
  }

  search() {
    this.resultService.getTestRecordsByParams(this.testId, this.groupId).subscribe((records: any[]) => {
      console.log(records);
    });
  }
}
