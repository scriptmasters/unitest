import { Component, OnInit } from '@angular/core';
import { SpecialityService } from './speciality.service';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { PopupFormComponent } from './popup-form/popup-form.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.scss']
})
export class SpecialitiesComponent implements OnInit {
  constructor(public speciality: SpecialityService,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router) { }

    error: string;
    searchBox = new FormControl();
    searchBoxSubscr: Subscription;

  ngOnInit() {
    this.speciality.getSpecialities().subscribe(value => {
      this.speciality.specialitiesObject = value;

    }, error => {
      console.log('error' + error);
    });

    this.searchBoxSubscr = this.searchBox.valueChanges
        .debounceTime(1000)
        .subscribe(newValue => {
            this.speciality.getSearchedSpecialities(newValue)
                .subscribe(
                    (data: any) => {
                        if (data.response === 'no records') {
                            this.speciality.specialitiesObject = undefined;
                            this.error = 'За даним пошуковим запитом дані відсутні';
                        } else {
                            this.speciality.specialitiesObject = data;
                        }
                    }
                );
        });
  }


  delete(id) {
    this.speciality.specialitiesObject = this.speciality.specialitiesObject.filter(item => item.speciality_id !== id);
      return this.http.get('Speciality/del/' + id, { withCredentials: true }).subscribe(value => {
    });
  }

  getGroups(id): void {
    this.router.navigate(['admin/groups'], { queryParams: { specialityId: id} });
  }
  update(key) {
    this.speciality.oldspeciality = {};
    Object.assign(this.speciality.oldspeciality, key);
    this.speciality.speciality = key;
    const dialogRef = this.dialog.open(PopupFormComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response === 'ok') {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Cпеціальність було успішно додано!'
          }
        });
      } else if  ((response === 'error')) {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Виникла помилка при додаванні спеціальності!'
          }
        });
      }
    });
  }

  openModal() {
    this.speciality.speciality = {
      speciality_name: '',
      speciality_code: '',
      speciality_id: ''
    };
    const dialogRef = this.dialog.open(PopupFormComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response === 'ok') {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Cпеціальність було успішно додано!'
          }
        });
      } else if ((response === 'error')) {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Виникла помилка при додаванні спеціальності!'
          }
        });
      }
    });
  }

}
{
  id34: {field: [12,18]}
}
