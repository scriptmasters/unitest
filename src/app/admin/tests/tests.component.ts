import { Component, OnInit} from '@angular/core';
import {TestService } from './test.service';
import {Test} from './test';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EditComponent } from './edit/edit.component';


@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit{

  public test;
  
  constructor(private httpService: TestService, public dialog: MatDialog) { }

 
  ngOnInit() {
    this.getTests();
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
 
   openDialog(t: object, id: number) {
   const matDialogRef = this.dialog.open(EditComponent, {data: {id: id, test: t}});
   matDialogRef.afterClosed().subscribe(()=>this.getTests())
   }
}
