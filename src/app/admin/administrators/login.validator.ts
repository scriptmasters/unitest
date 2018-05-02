import { AbstractControl } from '@angular/forms';
import { AdministratorsService } from './administrators.service';

export class ValidateLoginNotTaken {
  static createValidator(service: AdministratorsService, updating) {
    let counter = 0;
    return (control: AbstractControl) => {
      if (updating && counter < 1) {
        counter++;
        return service.checkUsername(control.value).map(res => {
          return null;
        });
      }
      return service.checkUsername(control.value).map(res => {
        return res ? null : { loginTaken: true };
      });
    };
  }
}
