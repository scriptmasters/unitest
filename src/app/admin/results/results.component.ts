import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ResultsService } from "./results.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  testId: number;
  testName: string[];

  constructor(
    private route: ActivatedRoute,
    private results: ResultsService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(() =>{
      this.testId = 1;
      this.getTestById();
    })
  }

  private getTestById(): void {
    this.results.getTestById(this.testId).subscribe((resp: any[]) => {
      this.testName = resp[0].test_name;
    })
  }

}
