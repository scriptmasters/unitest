import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { AdministratorsService } from '../administrators.service';
import { Administrators } from '../administratorsInterface';
import { matchOtherValidator } from '../confirm_password.validator';


@Component({
  selector: 'app-administrators-dialog',
  templateUrl: './administrators-dialog.component.html',
  styleUrls: ['./administrators-dialog.component.scss']
})
export class AdministratorsDialogComponent implements OnInit {

    administrators: Administrators[];
    form: FormGroup;

  constructor(private matDialogRef: MatDialogRef<AdministratorsDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private administratorsService: AdministratorsService,) { }

     ngOnInit() {
        this.form = new FormGroup({
         'login': new FormControl(null, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)]),
         'email': new FormControl(null, [
          Validators.email,
          Validators.minLength(5),
          Validators.maxLength(100)]),
         'password': new FormControl(null, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)]),
         'confirm_password': new FormControl(null, [
          Validators.required,
          matchOtherValidator('password')])
        });
     };

 closeDialog() {
     this.matDialogRef.close();
    }

  onSubmit() {
    const formData = this.form.value;
    this.administratorsService.addAdministrator(formData.login, formData.email, formData.password, formData.confirm_password,)
      .subscribe((administrator: Administrators[]) => {
        if (administrator) { 
          this.matDialogRef.close();
        }
      });
  }
}
