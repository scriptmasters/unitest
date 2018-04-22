import { AbstractControl } from '@angular/forms';
import { StudentsService } from './students.service';

export class ValidateLoginNotTaken {
  static createValidator(service: StudentsService) {
    return (control: AbstractControl) => {
      return service.checkUsername(control.value).map(res => {
        return res ? null : { loginTaken: true };
      });
    };
  }
}
