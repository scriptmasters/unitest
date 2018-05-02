import { Component, OnInit } from '@angular/core';
import { SpecialityService } from './speciality.service';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { PopupFormComponent } from './popup-form/popup-form.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { Router } from '@angular/router';
import { Speciality, IResponse } from './specialityInterface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.scss']
})
export class SpecialitiesComponent implements OnInit {
  searchStr = '';
  specialitys: Speciality[];
  form: FormGroup;
  constructor(private speciality: SpecialityService,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router) { }

    error: string;
    searchBox = new FormControl();

  ngOnInit() {
    this.getAllSpeciality();
  }
  getAllSpeciality(): void {
    this.speciality.getSpecialities().subscribe((data: Speciality[]) => {
      this.specialitys = data;

    }, error => {
      console.log('error' + error);
    });
  }
  getGroups(id): void {
    this.router.navigate(['admin/groups'], { queryParams: { facultyId: id } });
  }
  openModal(id): void {
    const dialogRef = this.dialog.open(PopupFormComponent, {
      disableClose : true,
      width: '600px',
      data: { speciality_id: id }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        if (response.status === 'SUCCESS') {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: response.message
            }
          });
          this.getAllSpeciality();
        } else if ((response.status === 'ERROR')) {
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
  delete(id): void {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '500px',
      data: { message: 'Ви справді бажаєте видалити дану спеціальность?' }
    });
    dialogRef.afterClosed().subscribe((Response: boolean) => {
      if (Response) {
        this.speciality.delSpecialitiey(id).subscribe((data: IResponse) => {
          if (data.response === 'ok') {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: 'Спеціальность було успішно видалено!'
              }
            });
            this.getAllSpeciality();
          }
        },
          () => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: 'Неможливо видалити даний спеціальность, тому що він не є порожнім!'
              }
            });
          });
      }
    });
  }
}

