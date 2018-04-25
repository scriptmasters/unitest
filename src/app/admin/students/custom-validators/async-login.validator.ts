import { AbstractControl } from '@angular/forms';
import { StudentsService } from '../students.service';

export class ValidateLoginNotTaken {
  static createValidator(service: StudentsService, updating) {
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
