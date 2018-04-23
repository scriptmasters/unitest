import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import * as moment from 'moment';

export function startDateValidator(
  control: AbstractControl
): { [key: string]: any } {
  const today = moment();
  const enteredDate = moment(control.value);

  return enteredDate.isBefore(today, 'days')
    ? { invalidDate: { value: control.value } }
    : null;
}

export function matchDates(AC: AbstractControl) {
  const startdate = moment(AC.get('startDate').value); // to get value in input tag
  const enddate = moment(AC.get('endDate').value); // to get value in input tag
  if (enddate.isBefore(startdate, 'days')) {
    AC.get('endDate').setErrors({ earlierThanStartDate: true });
  } else {
    return null;
  }
}
