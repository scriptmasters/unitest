import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AdministratorsService} from '../services/administrators.service';
import {Administrators} from '../administratorsInterface';
import {matchOtherValidator} from '../../../shared/form_validation/confirm_password.validator';
import {ValidateLoginNotTaken} from '../../../shared/form_validation/asyncLogin.validator';
import {ValidateEmailNotTaken} from '../../../shared/form_validation/asyncEmail.validator';
import {ValidatePassword} from '../../../shared/form_validation/checkOldPassword.validator';

@Component({
  selector: 'app-administrators-dialog',
  templateUrl: './administrators-dialog.component.html',
  styleUrls: ['./administrators-dialog.component.scss']
})
export class AdministratorsDialogComponent implements OnInit {

  administrator = [{ username: '', email: '', password: '', confirm_password: '' }];
  form: FormGroup;
  isLoaded = true;
  CryptoJS = require('crypto-js');
  currentEmail;
  currentLogin;
  currentPassword;

  constructor(private matDialogRef: MatDialogRef<AdministratorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private administratorsService: AdministratorsService) { }

  ngOnInit() {
    if (this.data.id) {
      this.isLoaded = false;
      const id = this.data.id;
      this.administratorsService.getAdministratorById(id)
        .subscribe((administrator: Administrators[]) => {
          this.administrator = administrator;
          this.currentEmail = this.administrator[0].email;
          this.currentLogin = this.administrator[0].username;
          this.currentPassword = this.administrator[0].password;
          this.isLoaded = true;
        this.form = new FormGroup({
         'login': new FormControl(null, {
          validators: [
            Validators.required,
            Validators.pattern('(([A-Za-z0-9]){3,})'),
            Validators.maxLength(15)],
          asyncValidators: this.data.id ?
            ValidateLoginNotTaken.createValidator(this.administratorsService, true, this.currentLogin ) :
            ValidateLoginNotTaken.createValidator(this.administratorsService, false, this.currentLogin)}),
         'email': new FormControl(null, {
           validators: [
             Validators.email,
             Validators.minLength(5),
             Validators.maxLength(20)],
           asyncValidators: this.data.id ?
             ValidateEmailNotTaken.createValidator(this.administratorsService, true, this.currentEmail) :
             ValidateEmailNotTaken.createValidator(this.administratorsService, false, this.currentEmail)}),
         'oldPassword': new FormControl(null, [
             Validators.required,
             ValidatePassword(this.currentPassword)]),
         'password': new FormControl(null, [
             Validators.required,
             Validators.pattern('(([A-Za-z0-9]){8,})'),
             Validators.maxLength(16)]),
          'confirm_password': new FormControl(null, [
             Validators.required,
             matchOtherValidator('password')])
           }, { updateOn: 'blur' });
        });
      } else {
        this.form = new FormGroup({
         'login': new FormControl(null, {
          validators: [
            Validators.required,
            Validators.pattern('(([A-Za-z0-9]){3,})'),
            Validators.maxLength(15)],
          asyncValidators:
            ValidateLoginNotTaken.createValidator(this.administratorsService, false, false)}),
         'email': new FormControl(null, {
           validators: [
             Validators.email,
             Validators.minLength(5),
             Validators.maxLength(20)],
           asyncValidators:
             ValidateEmailNotTaken.createValidator(this.administratorsService, false, false)}),
         'password': new FormControl(null, [
             Validators.required,
             Validators.pattern('(([A-Za-z0-9]){8,})'),
             Validators.maxLength(16)]),
          'confirm_password': new FormControl(null, [
             Validators.required,
             matchOtherValidator('password')])
           }, { updateOn: 'blur' });
      }
}

  onSubmit() {
    const formData = this.form.value;
    if (this.data.id) {
      const hashCurrrentPas = this.CryptoJS.HmacSHA256(formData.password, 'tuhes');
      const hexCurrentPassword = hashCurrrentPas.toString(this.CryptoJS.enc.Hex);
      const id = this.data.id;
      if (formData.login !== this.currentLogin || formData.email !== this.currentEmail || hexCurrentPassword !== this.currentPassword ) {
      this.administratorsService.updateAdministrator(id, formData.login, formData.email, formData.password, formData.confirm_password)
        .subscribe(() =>
          this.matDialogRef.close({ status: 'SUCCESS', message: 'Адміністратора було успішно відредаговано!' })
         );
      } else {
          this.matDialogRef.close({ status: 'ERROR', message: 'Ви не внесли жодних змін при редагуванні!' });
        }

    } else {
      this.administratorsService.addAdministrator(formData.login, formData.email, formData.password, formData.confirm_password)
        .subscribe(() =>
          this.matDialogRef.close({ status: 'SUCCESS', message: 'Адміністратора було успішно додано!' }),
          () => this.matDialogRef.close({ status: 'ERROR', message: 'Адміністратор з таким логіном або поштовою скринькою вже існує!' })
        );
    }
  }

      passwordVisibility(event: Event) {
        const elem = event.srcElement.previousElementSibling;
          if (elem.getAttribute('type') === 'password') {
            elem.setAttribute('type', 'text');
          } else {
            elem.setAttribute('type', 'password');
          }
      }

      closeDialog() {
        this.matDialogRef.close();
      }
}
