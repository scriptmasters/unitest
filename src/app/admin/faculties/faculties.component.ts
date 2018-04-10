import { Component, OnInit } from '@angular/core';
import { FacultiesService } from './faculties.service';
import { MatDialog } from '@angular/material';
import { Faculties, IResponse } from './facultiesInterface';
import { FacultiesAddComponent } from './faculties-add/faculties-add.component';
import { FacultiesUpdateComponent } from './faculties-update/faculties-update.component';
//import { FacultiesDeleteComponent } from './faculties-delete/faculties-delete.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.scss']
})
export class FacultiesComponent implements OnInit {
   
  faculties: Faculties;
  form: FormGroup;

  constructor(private facultiesService: FacultiesService, public dialog: MatDialog) { }
  

   ngOnInit() {
      this.getAllFaculties();
    };


      getAllFaculties(): void { 
         this.facultiesService.getFaculties()
            .subscribe((data: Faculties) => {
            this.faculties = data;
    })
   }

  // Модальне вікно додавання
  openAddModal() {
    let dialogRef =this.dialog.open(FacultiesAddComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllFaculties();
    });
  }


// Модальне вікно редагування
  public openUpdateModal(id): void {
    let dialogRef = this.dialog.open(FacultiesUpdateComponent, {
      width: '400px',
      data: { faculty_id: id }
    });   
    dialogRef.afterClosed().subscribe(() => {
      this.getAllFaculties();
    });
  }

// Видалення
 deleteItem(index): void {
    this.facultiesService.delFaculties(index).subscribe((data: IResponse) => {
      if(data.response === 'ok') {
        this.getAllFaculties();
      }
    });
  }
}

