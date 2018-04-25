import { Component, OnInit} from '@angular/core';
import {TestService } from './test.service';
import { MatDialog } from '@angular/material';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

  public test;
  public subjectId: number;
  constructor(private httpService: TestService, public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
    this.subjectId = params['subjectId'];
    });
   }
   ngOnInit() {
    this.getTestsById(this.subjectId);
  }

  deleteTest(id: number) {
    this.httpService.deleteTest(id).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
        },
      () => this.getTestsById(this.subjectId)
    );
   }

   getTestsById(id: number) {
     this.httpService.getTestsById(this.subjectId).subscribe(
       data => {this.test = data; }
     );
   }

   openDialog(t: object, id: number) {
   const matDialogRef = this.dialog.open(EditComponent, {
    width: '350px',
    data: {id: id, test: t}});
   matDialogRef.afterClosed().subscribe(() => this.getTestsById(this.subjectId));
  }
   addDialog() {
    const matDialogRef = this.dialog.open(AddComponent, {width: '350px', data: {id: this.subjectId}});
    matDialogRef.afterClosed().subscribe(() => this.getTestsById(this.subjectId));
   }

   openDetails(id: any) {
    this.router.navigate(['/admin/testdetails'], {
      queryParams: {
        id: id
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
}
