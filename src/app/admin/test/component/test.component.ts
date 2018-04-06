import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  tests = [];

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.testService.getTest().subscribe((res: any[]) => {
      this.tests = res;
    });
  }

}
