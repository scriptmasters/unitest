import {AbstractControl} from '@angular/forms';

export function ValidatePassword(adminPassword: any) {
    return (control: AbstractControl) => {
        const CryptoJS = require('crypto-js');
        const currentPassword = control.value;
        const hashCurrrentPas = CryptoJS.HmacSHA256(currentPassword, 'tuhes');
        const hexCurPassword = hashCurrrentPas.toString(CryptoJS.enc.Hex);
            if (hexCurPassword === adminPassword || !currentPassword) {
              return null;
            } else {
                return { validPassword: true };
            }
    };
}
