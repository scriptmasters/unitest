import { Component, OnInit } from '@angular/core';
import { SpecialityService } from './speciality.service';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { PopupFormComponent } from './popup-form/popup-form.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { Router } from '@angular/router';
import { Speciality, IResponse } from './specialityInterface';
import { FormControl, FormGroup } from '@angular/forms';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.scss']
})
export class SpecialitiesComponent implements OnInit {

  specialitys: Speciality[];
  form: FormGroup;
  error: string;
  searchBox = new FormControl();
  searchBoxSubscr: Subscription;
  config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  constructor(private speciality: SpecialityService,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.getAllSpeciality();
    this.searchBoxSubscr = this.searchBox.valueChanges
        .debounceTime(1000)
        .subscribe(newValue => {
            this.speciality.getSearchedSpecialities(newValue)
                .subscribe(
                    (data: any) => {
                        if (data.response === 'no records') {
                            this.specialitys = undefined;
                            this.error = 'За даним пошуковим запитом дані відсутні';
                        } else {
                            this.specialitys = data;
                        }
                    }
                );
        });
  }
  getAllSpeciality(): void {
    this.speciality.getSpecialities().subscribe((data: Speciality[]) => {
      this.specialitys = data;

    }, error => {
      console.log('error' + error);
    });
  }
  getGroups(id): void {
    this.router.navigate(['admin/groups'], { queryParams: { specialityId: id } });
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

