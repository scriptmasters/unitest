import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { AdministratorsService } from '../administrators.service';
import { Administrators } from '../administratorsInterface';
import { matchOtherValidator } from '../confirm_password.validator';
import { ValidateLoginNotTaken } from '../login.validator';
import { ValidateEmailNotTaken } from '../email.validator';

@Component({
  selector: 'app-administrators-dialog',
  templateUrl: './administrators-dialog.component.html',
  styleUrls: ['./administrators-dialog.component.scss']
})
export class AdministratorsDialogComponent implements OnInit {

    administrator = [{username: '', email: '', password: '', confirm_password: ''}];
    form: FormGroup;
    isLoaded = true;

  constructor(private matDialogRef: MatDialogRef<AdministratorsDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private administratorsService: AdministratorsService,) { }

     ngOnInit() {
        this.getAdministrator();

        this.form = new FormGroup({
         'login': new FormControl(null, {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100)],
          asyncValidators: this.data.updating ?
            ValidateLoginNotTaken.createValidator(this.administratorsService, true) :
            ValidateLoginNotTaken.createValidator(this.administratorsService, false),
            updateOn: 'blur'}),
         'email': new FormControl(null, {
           validators: [
             Validators.email,
             Validators.minLength(5),
             Validators.maxLength(100)],
           asyncValidators: this.data.updating ?
             ValidateEmailNotTaken.createValidator(this.administratorsService, true) :
             ValidateEmailNotTaken.createValidator(this.administratorsService, false),
             updateOn: 'blur'
          }),
         'password': new FormControl(null, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)]),
         'confirm_password': new FormControl(null, [
          Validators.required,
          matchOtherValidator('password')])
        });
     };

     getAdministrator(): void {
       if (this.data.id) {
         this.isLoaded = false;
         const id = this.data.id;
         this.administratorsService.getAdministratorById(id)
           .subscribe((administrator: Administrators[]) => {
            this.administrator = administrator;
            this.isLoaded = true;
         });
      }
     }

     onSubmit() {
       const formData = this.form.value;
         if (this.data.id) {
           const id = this.data.id;
           this.administratorsService.updateAdministrator(id, formData.login, formData.email, formData.password, formData.confirm_password )
             .subscribe(() =>
                this.matDialogRef.close({status: 'SUCCESS', message: 'Адміністратора було успішно відредаговано!'}),
             () => this.matDialogRef.close({status: 'ERROR', message: 'Ви не внесли ніяких змін при редагуванні!'})
             );
        } else {
            this.administratorsService.addAdministrator(formData.login, formData.email, formData.password, formData.confirm_password)
              .subscribe(() =>
                this.matDialogRef.close({status: 'SUCCESS', message: 'Адміністратора було успішно додано!'}),
                () => this.matDialogRef.close({status: 'ERROR', message: 'Адміністратор з таким логіном або поштовою скринькою вже існує!'})
            );
        }
     } 

 closeDialog() {
     this.matDialogRef.close();
    }
}
