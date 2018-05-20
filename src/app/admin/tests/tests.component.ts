import {Component, OnInit} from '@angular/core';
import {TestService} from './test.service';
import {MatDialog} from '@angular/material';
import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {IResponse} from './test';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';


@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {
  test;
  subject;
  subjectId: number;
  answer = true;

  constructor(private httpService: TestService, public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.subjectId = params['subjectId'];
    });
  }

  ngOnInit() {
    this.getTestsById(this.subjectId);
    this.getSubjects();
  }

  checkRecords(): boolean {
    return this.answer;
  }

  deleteTest(id: number): void {
    const matDialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '400px',
      data: {message: 'Ви справді хочете видалити цей тест?'}
    });
    matDialogRef.afterClosed().subscribe((Response: boolean) => {
      if (Response) {
        this.httpService.deleteTest(id).subscribe((data: IResponse) => {
            if (data.response === 'ok') {
              this.openModalMessage('Тест успішно видалено');
            }
          },
          (err) => {
            this.openModalMessage('Цей тест неможливо видалити, оскільки в ньому є питання! '); },
          () => {
            this.getTestsById(this.subjectId);
          }
        ); }
    });
  }

  getTestsById(id: number): void {
    this.httpService.getTestsById(id).subscribe(
      data => {
        if (data.hasOwnProperty('response')) {
          this.answer = false;
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'За даним запитом тестів не знайдено'
            }
          });
        } else {
          this.answer = true;
          this.test = data;
        }
      }
    );
  }

  openDialog(t: object, id: number): void {
    const matDialogRef = this.dialog.open(EditComponent, {
      width: '400px',
      disableClose: true,
      data: {id: id, test: t}});
    matDialogRef.afterClosed().subscribe(() => this.getTestsById(this.subjectId));
  }

  addDialog() {
    const matDialogRef = this.dialog.open(AddComponent, {
      disableClose: true,
      width: '400px', data: {id: this.subjectId}});
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


  openQuestions(test_id: string) {
        this.router.navigate(['/admin/questions'], {
          queryParams: {
              subjectId: this.subjectId,
              testId: test_id, }
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
