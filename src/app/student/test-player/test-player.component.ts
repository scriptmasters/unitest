import { Component, OnInit } from '@angular/core';

import {TestPlayerService} from '../services/test-player.service';
import {Subject} from '../../admin/subjects/subject';

@Component({
  selector: 'app-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.scss']
})
export class TestPlayerComponent implements OnInit {

  constructor(
    private testPlayerService: TestPlayerService
  ) { }

  ngOnInit() {
    this.startTest();
    this.getRandomQuestion();
  }

  startTest(): void {
    this.testPlayerService.startTest()
    .subscribe((response: any) => {
      console.log(response);
    });
  }

  getRandomQuestion(): void {
    this.testPlayerService.getRandomQuestion()
      .subscribe((response: any) => {
        console.log(response);
      });
  }
}
