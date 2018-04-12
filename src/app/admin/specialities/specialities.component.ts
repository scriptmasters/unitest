import { Component, OnInit } from '@angular/core';
import { SpecialityService } from './speciality.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { identifierModuleUrl } from '@angular/compiler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PopupFormComponent } from '../specialities/popup-form/popup-form.component'
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import {Router} from '@angular/router';
const URL = "http://vps9615.hyperhost.name:443/api";


import { MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.scss']
})
export class SpecialitiesComponent implements OnInit {
  constructor(private speciality: SpecialityService,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.speciality.getSpecialities().subscribe(value => {
      this.speciality.specialitiesObject = value;

    }, error => {
      console.log("error" + error);
    })

  }


  delete(id) {
    this.speciality.specialitiesObject = this.speciality.specialitiesObject.filter(item => item.speciality_id !== id);
      return this.http.get(URL + "/Speciality/del/" + id, { withCredentials: true }).subscribe(value => {
    })
  }

  getGroups(id): void {
    this.router.navigate(['admin/groups'], { queryParams: { facultyId: id} });
  }
  update(key) {
    this.speciality.oldspeciality = {};
    Object.assign(this.speciality.oldspeciality, key);
    this.speciality.speciality = key;
    let dialogRef = this.dialog.open(PopupFormComponent, {
      width: '600px',
      height: "calc(100vh - 50px)",
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response === "ok") {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Профіль цього студента було успішно додано!'
          }
        });
      } else if  ((response =='error')) {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Виникла помилка при додаванні цього студента!'
          }
        });
      }
    });
  }

  openModal() {
    this.speciality.speciality = {
      speciality_name: "",
      speciality_code: "",
      speciality_id: ""
    };
    let dialogRef = this.dialog.open(PopupFormComponent, {
      width: '600px',
      height: "calc(100vh - 50px)",
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response === "ok") {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Профіль цього студента було успішно додано!'
          }
        });
      } else if ((response =='error')) {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Виникла помилка при додаванні цього студента!'
          }
        });
      }
    });
  };

}
