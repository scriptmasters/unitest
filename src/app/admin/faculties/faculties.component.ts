import { Component, OnInit } from '@angular/core';
import { FacultiesService } from './faculties.service';
import { MatDialog } from '@angular/material';
import { Faculties, IResponse } from './facultiesInterface';
import { FacultiesDialogComponent } from './faculties-dialog/faculties-dialog.component';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
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
  searchStr = '';

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
    });
   }

    getGroups(id): void {
    this.router.navigate(['admin/groups'], { queryParams: { facultyId: id} });
  }

// Add and update operations
  openDialog(id): void {
    const matDialogRef = this.dialog.open(FacultiesDialogComponent, {
      width: '500px',
      data: {faculty_id: id}
    });

      matDialogRef.afterClosed().subscribe((response: any) => {
        if (response) {
          if (response.status === 'SUCCESS') {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: response.message
              }
            });
            this.getAllFaculties();
          } else if (response.status === 'ERROR') {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: response.message
              }
            });
          }
          }
      });
  }

// Delete operation
 deleteFaculty(id): void {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        width: '500px',
        data: { message: 'Ви справді бажаєте видалити даний факультет?'}
    });
        dialogRef.afterClosed().subscribe((Response: boolean) => {
      if (Response) {
        this.facultiesService.delFaculties(id).subscribe((data: IResponse) => {
        if (data.response === 'ok') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Факультет було успішно видалено!'
            }
          });
          this.getAllFaculties();
        }},
        () => {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Неможливо видалити даний факультет, тому що він не є порожнім!'
            }
          });
        });
      }
    });
  }
}
