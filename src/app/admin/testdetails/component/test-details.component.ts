import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TestDetailsService } from '../sevices/test-details.service';

import { TestDetailCreateComponent } from '../modals/test-detail-create/test-detail-create.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-testdetails',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.scss']
  })

export class TestDetailsComponent implements OnInit {

  testDetails: any[];
  testId: number;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private testDetailsService: TestDetailsService) { }

  ngOnInit() {
    this.testId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.getTestDetails();

    this.route.queryParams.subscribe(params => {
      this.testId = params['id'];
      this.getTestDetails();
    });

  }

  openDialog(testDetails: any) {
    const dialogRef = this.dialog.open(TestDetailCreateComponent, {
      width: '700px',
      data: testDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTestDetails();
      }
    });
  }

  delete(id: number) {
    this.testDetailsService.deleteTestDetail(id).subscribe(() => {
      this.getTestDetails();
    }, err => {
      alert(err.error.response);
    });
  }

  private getTestDetails() {
    this.testDetailsService.getTestDetails(this.testId).subscribe((resp: any[]) => {
      this.testDetails = resp;
    });
  }
}
