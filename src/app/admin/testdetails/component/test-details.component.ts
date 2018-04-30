import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TestDetailsService } from '../sevices/test-details.service';

import { TestDetailCreateComponent } from '../modals/test-detail-create/test-detail-create.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteConfirmComponent } from '../../../shared/delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from "../../../shared/response-message/response-message.component";
// import {error} from "selenium-webdriver";

@Component({
  selector: 'app-testdetails',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.scss']
})

export class TestDetailsComponent implements OnInit {

  testDetails: any[];
  testId: number;
  testName: string[];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private testDetailsService: TestDetailsService
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.testId = params['id'];
      this.getTestDetails();
      this.getTestById();

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
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      data: {message: 'Ви впевнені, що хочете видалити цей запис?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.testDetailsService.deleteTestDetail(id).subscribe(() => {
          this.getTestDetails();
        }, err => {
          alert(err.error.response);
        });
      }
    }, () => {
      // this.dialog.open(ResponseMessageComponent, {
      //   width: '350px',
      //   data: {message: `Виникла помилка видалення: ${err.error.response}` }
      // })
    },() => {
      this.dialog.open(ResponseMessageComponent, {
        width: '350px',
        data: {message: 'Деталі тесту видалено'}
      });
    });
  }

  private getTestDetails() {
    this.testDetailsService.getTestDetails(this.testId).subscribe((resp: any[]) => {
      this.testDetails = resp;
    });
  }

  private getTestById(): void {
    this.testDetailsService.getTestById(this.testId).subscribe((resp: any[]) => {
      this.testName = resp[0].test_name;
    });
  }

}
