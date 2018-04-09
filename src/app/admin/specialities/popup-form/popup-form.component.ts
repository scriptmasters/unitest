import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { SpecialityService } from '../speciality.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.scss']
})
export class PopupFormComponent implements OnInit {
  popupValue: any;
  specialityUpdate = this.speciality.speciality;
  constructor(private matDialogRef: MatDialogRef<PopupFormComponent>, @Inject(MAT_DIALOG_DATA)
  private http: HttpClient,
    private speciality: SpecialityService) { }

  ngOnInit() {
  }
  addSpesi(value: any) {
    this.popupValue = value;
    let popupForm = JSON.stringify(this.popupValue)
    this.speciality.addSpecialities(popupForm).subscribe(response => {
      this.speciality.specialitiesObject.push(response.pop());

    });
  }
  public close() {
    this.matDialogRef.close();
  }
}
