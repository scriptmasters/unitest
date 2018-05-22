import {FormControl} from '@angular/forms';
import {AdministratorsService} from '../services/administrators.service';

export class ValidateEmailNotTaken {
  static createValidator(service: AdministratorsService, updating: boolean, currentEmail: any) {
    return (control: FormControl) => {
      if ( updating ) {
        return service.checkEmailAddress(control.value).map(res => {
          if (currentEmail === control.value) { return; }
            return res ? null : { emailTaken: true };
        });
      }
      return service.checkEmailAddress(control.value).map(res => {
        return res ? null : { emailTaken: true };
      });
    };
  }
}
