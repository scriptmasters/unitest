import { Component, OnInit } from '@angular/core';
import { SpecialityService } from './speciality.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { identifierModuleUrl } from '@angular/compiler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PopupFormComponent } from '../specialities/popup-form/popup-form.component'
@Component({
  selector: 'app-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.scss']
})
export class SpecialitiesComponent implements OnInit {

  constructor(private speciality: SpecialityService,
    private http: HttpClient,
    public dialog: MatDialog) { }

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

  openModal() {
    this.dialog.open(PopupFormComponent, {
      width: '600px',
    })
  };
  update(key) {
    this.speciality.speciality = key;
    this.dialog.open(PopupFormComponent, {
      width: '600px',
    })
  };
}
