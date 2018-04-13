import { Component, OnInit } from '@angular/core';
import { FacultiesService } from './faculties.service';
import { MatDialog } from '@angular/material';
import { Faculties, IResponse } from './facultiesInterface';
import { FacultiesAddComponent } from './faculties-add/faculties-add.component';
import { FacultiesUpdateComponent } from './faculties-update/faculties-update.component';
import { FacultiesDeleteComponent } from './faculties-delete/faculties-delete.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import {PaginationInstance} from 'ngx-pagination';
import {Router} from '@angular/router';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.scss']
})
export class FacultiesComponent implements OnInit {
   
  faculties: Faculties[];
  form: FormGroup;

  public config: PaginationInstance = {
     itemsPerPage: 5,
     currentPage: 1
  };
  
 constructor(private facultiesService: FacultiesService, public dialog: MatDialog, private router: Router) { }
  
   ngOnInit() {
      this.getAllFaculties();
    }

    getAllFaculties(): void { 
      this.facultiesService.getFaculties()
           .subscribe((data: Faculties[]) => {
           this.faculties = data;
    })
   };

    getGroups(id): void {
    this.router.navigate(['admin/groups'], { queryParams: { facultyId: id} });
  }

  // Модальне вікно додавання
  openAddModal() {
    let dialogRef =this.dialog.open(FacultiesAddComponent, {
        width: '400px'
    });
    dialogRef.afterClosed().subscribe((Response: string)=> {
          this.getAllFaculties();
        });
  }

// Модальне вікно редагування
  openUpdateModal(id): void {
    let dialogRef = this.dialog.open(FacultiesUpdateComponent, {
        width: '400px',
        data: { faculty_id: id }
    });   
        dialogRef.afterClosed().subscribe(() => {
        this.getAllFaculties();
        });
  }

// Модальне вікно видалення
 openDeleteModal(num): void {
    let dialogRef = this.dialog.open(FacultiesDeleteComponent, {
        width: '400px',
        data: { id: num }
    });   
        dialogRef.afterClosed().subscribe((Response: string)=> {
      if (Response) {
        if (Response === 'ok') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Факультет було успішно видалено!'
            }
          });
          this.getAllFaculties();
        } else if (Response.toLowerCase().includes("error")) {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Виникла помилка при видаленні цього факультета!'
            }
          });
        }
      }
    });
 }
}