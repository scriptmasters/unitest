import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { SpecialityService } from '../speciality.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.scss']
})
export class PopupFormComponent implements OnInit {
  popup: any;
  popupValue: any;
  specialityUpdate = this.speciality.speciality;
  constructor(

    private matDialogRef: MatDialogRef<PopupFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private http: HttpClient,
    private speciality: SpecialityService) { }

  ngOnInit() {
  }

  onSubmit(value: any) {
    if (this.specialityUpdate.speciality_id == '') {
      this.popupValue = value;
      const popupForm = JSON.stringify(this.popupValue);
      this.speciality.addSpecialities(popupForm).subscribe(
        response => {
          this.matDialogRef.close('ok');
          this.speciality.specialitiesObject.push(response.pop());
        },
        error => {
          this.matDialogRef.close('error');
        });
    } else {
      const id = this.specialityUpdate.speciality_id;

      this.popup = value;
      const popupForm = JSON.stringify(this.popup);
      this.speciality.editSpecialities(id, popupForm).subscribe(
        response => {
          this.matDialogRef.close('ok');
        },
        error => {
          this.revertEditedValue();
          this.matDialogRef.close('error');
        });
    }
  }

  public close() {
    this.revertEditedValue();
    this.matDialogRef.close();
  }

  private revertEditedValue() {
    if (!this.speciality.oldspeciality) {
      return;
    }
    const id = this.speciality.oldspeciality.speciality_id;
    this.speciality.specialitiesObject.forEach(element => {
      if (element.speciality_id == id) {
        Object.assign(element, this.speciality.oldspeciality);
      }
    });
  }

}
