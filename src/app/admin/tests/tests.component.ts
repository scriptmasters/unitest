import { Component, OnInit} from '@angular/core';
import {TestService } from './test.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import { IResponse, Subject, Test } from './test';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {
  test;
  subject;
  subjectId: number;
  counter = 0;
  length = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  pageEvent: PageEvent;

  constructor(private httpService: TestService, public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.subjectId = params['subjectId'];
    });
  }

  ngOnInit() {
    this.getTestsById(this.subjectId);
    this.getSubjects();
  }

  deleteTest(id: number): void {
    const matDialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '350px',
      data: {message: 'Ви справді хочете видалити цей тест?'}
    });
    matDialogRef.afterClosed().subscribe((Response: boolean) => { //bug коли нема рекордів модалку не можна закрити
      if (Response) {
        this.httpService.deleteTest(id).subscribe((data: IResponse) => {
            if (data.response === 'ok') {
              this.openModalMessage('Тест успішно видалено');
            }
          },
          () => {
            this.openModalMessage('Виникла помилка при видаленні тесту'); 
          },
          () => {
            this.getTestsById(this.subjectId);
          }
        ); }
    });
  }

  getTestsById(id: number): void {
    this.httpService.getTestsById(id).subscribe(
      data => {
        if(data.hasOwnProperty('response') && this.counter === 0) {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'За даним запитом тестів не знайдено'
            }
          });
          this.counter++;
        } else
        this.test = data;
        console.log('works ' + id);
      }
    );
  }

  openDialog(t: object, id: number): void {
    const matDialogRef = this.dialog.open(EditComponent, {
      disableClose: true,
      width: '350px',
      data: {id: id, test: t}});
    matDialogRef.afterClosed().subscribe(() => this.getTestsById(this.subjectId));
  }

  addDialog() {
    const matDialogRef = this.dialog.open(AddComponent, {
      disableClose: true,
      width: '350px', data: {id: this.subjectId}});
    matDialogRef.afterClosed().subscribe(() => this.getTestsById(this.subjectId));
  }

   openDetails(id: any): void {
    this.router.navigate(['/admin/testdetails'], {
      queryParams: {
        id: id
      }
    });
   }
   openModalMessage(msg: string, w: string = '350px'): void {
    this.dialog.open(ResponseMessageComponent, {
      width: w,
      data: {
        message: msg
      }
    });
  }

  openQuestions(id: any) {
    this.router.navigate(['/admin/questions'], {
      queryParams: {
        testId: id
      }
    });
  }

  getSubjects() {
    this.httpService.getSubjects().subscribe(
      (data) => {
        this.subject = data;
      }
    );
  }
  
}
