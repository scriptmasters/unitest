import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms'
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { SpecialityService } from '../speciality.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule } from '@angular/forms';
const URL = "http://vps9615.hyperhost.name:443/api";
@Component({
  selector: 'app-popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.scss']
})
export class PopupFormComponent implements OnInit {
  popup: any;
  popupValue: any;
  // oldspeciality = this.speciality.speciality;
  specialityUpdate = this.speciality.speciality;
  constructor(private matDialogRef: MatDialogRef<PopupFormComponent>, @Inject(MAT_DIALOG_DATA)
  private http: HttpClient,
    private speciality: SpecialityService) { }

  ngOnInit() {
    console.log(this.popupValue);

  }

  onSubmit(value: any) {
 

    if (this.specialityUpdate.speciality_id == '') {
      this.popupValue = value;
      let popupForm = JSON.stringify(this.popupValue)
      this.speciality.addSpecialities(popupForm).subscribe(response => {
        this.speciality.specialitiesObject.push(response.pop());

      });

      this.matDialogRef.close();
    } else {
      let id = this.specialityUpdate.speciality_id;
      console.log(this.specialityUpdate);
      this.speciality.specialitiesObject.forEach(element => {
        if (element.speciality_id == this.speciality.oldspeciality.speciality_id || element.speciality_name == this.speciality.oldspeciality.speciality_name) {
          alert("Дані вже існують")
          return;
        }
      });
      this.popup = value;
      let popupForm = JSON.stringify(this.popup)
      this.speciality.editSpecialities(id, popupForm).subscribe(response => {
        {
          this.matDialogRef.close();
        }
      });
    }
  }

  public close() {
    const id = this.speciality.oldspeciality.speciality_id;
    this.speciality.specialitiesObject.forEach(element => {
      if (element.speciality_id == id) {
        Object.assign(element, this.speciality.oldspeciality);
      }
    });

    this.matDialogRef.close();
  }



}
