import { AbstractControl } from '@angular/forms';
import { AdministratorsService } from '../services/administrators.service';

export class ValidateLoginNotTaken {
  static createValidator(service: AdministratorsService, updating: boolean, currentLogin: any) {
    return (control: AbstractControl) => {
      if ( updating ) {
        return service.checkUsername(control.value).map(res => {
          if (currentLogin === control.value) {return; }
            return res ? null : { loginTaken: true };
        });
      }
      return service.checkUsername(control.value).map(res => {
        return res ? null : { loginTaken: true };
      });
    };
  }
}
