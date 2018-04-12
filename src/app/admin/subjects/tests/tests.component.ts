import { Component, OnInit} from '@angular/core';
import {TestService } from './test.service';
import {Test} from './test';
import { MatDialog, MatDialogRef, MatButtonModule } from '@angular/material';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit{

  public test;
  public subjectId: number;
  constructor(private httpService: TestService, public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
    console.log('Called Constructor');
    this.activatedRoute.queryParams.subscribe(params => {
    this.subjectId = params['id'];
    });
   }
 

  ngOnInit() {
    this.getTestsById();
  }

  deleteTest(id: number) {
    this.httpService.deleteTest(id).subscribe(
      data => {console.log(data)},
      err => {console.log(err)},
      ()=> this.getTests()
    );
   }
   getTests():void {
    this.httpService.getTests().subscribe(
      data => {this.test = data},
      err => {console.error(err)},
      ()=> console.log()
    );
   }

   getTestsById() {
     this.httpService.getTestsById(this.subjectId).subscribe(
       data => {this.test = data}
     );
   }

   openDialog(t: object, id: number) {
   const matDialogRef = this.dialog.open(EditComponent, {
    width: '350px',
    data: {id: id, test: t}});
   matDialogRef.afterClosed().subscribe(()=>this.getTestsById())
   }
   addDialog() {
    const matDialogRef = this.dialog.open(AddComponent, {width: '350px'});
    matDialogRef.afterClosed().subscribe(() => this.getTestsById());
   }

   openDetails(id: any){
    this.router.navigate(['/admin/testdetails'], {
      queryParams: {
        id: id
      }
    });
   }
}
