import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {FacultiesService} from '../faculties.service';
import {Faculties, IResponse} from '../facultiesInterface';

@Component({
  selector: 'app-faculties-delete',
  templateUrl: './faculties-delete.component.html',
  styleUrls: ['./faculties-delete.component.scss']
})
export class FacultiesDeleteComponent implements OnInit {

  constructor(
    private facultiesService: FacultiesService, 
    public dialogRef: MatDialogRef<FacultiesDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  facultyDelete():void {
    this.facultiesService.delFaculties(this.data.id).subscribe(
      (data: IResponse) => this.dialogRef.close(data.response));
  }

  onNoClick():void {
    this.dialogRef.close();
  } 
  }

  
 

 


