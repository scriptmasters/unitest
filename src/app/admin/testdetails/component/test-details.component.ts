import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TestDetailsService } from '../sevices/test-details.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-testdetails',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.scss']
  })

export class TestDetailsComponent implements OnInit {

  testDetails: any[];
  private testId: number;

  constructor(private activatedRoute: ActivatedRoute,
              private testDetailsService: TestDetailsService) { }

  ngOnInit() {
    this.testId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
    this.testDetailsService.getTestDetails(1).subscribe((resp: any[]) => {
      this.testDetails = resp;
    });
  }

}
