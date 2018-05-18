import {Component, OnInit} from '@angular/core';
import {StatisticService} from './statistic.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  constructor(private Statistica: StatisticService) { }
  subjectObject: any;
  studentObject: any;
  testObject: any;
  adminObject: any;
  groupObject: any;
  questionObject: any;
  ngOnInit() {
    this.Statistica.countQuestion().subscribe(value => {
      this.questionObject = value;

    }, error => {
      console.log('error' + error);
    });
    this.Statistica.countSubject().subscribe(value => {
      this.subjectObject = value;

    }, error => {
      console.log('error' + error);
    });
    this.Statistica.countGroup().subscribe(value => {
      this.groupObject = value;

    }, error => {
      console.log('error' + error);
    });
    this.Statistica.countTest().subscribe(value => {
      this.testObject = value;

    }, error => {
      console.log('error' + error);
    });
    this.Statistica.countAdmin().subscribe(value => {
      this.adminObject = value;

    }, error => {
      console.log('error' + error);
    });
    this.Statistica.countStudent().subscribe(value => {
      this.studentObject = value;

    }, error => {
      console.log('error' + error);
    });
  }

}
