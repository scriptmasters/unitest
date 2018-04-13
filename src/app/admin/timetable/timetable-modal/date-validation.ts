import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import * as moment from 'moment';


export function startDateValidator(control: AbstractControl): { [key: string]: any } {
  const today = moment();
  const enteredDate = moment(control.value);

  return enteredDate.isBefore(today, 'days') ? { 'invalidDate': { value: control.value } } : null;
};

export function matchDates(AC: AbstractControl) {
  let startdate = moment(AC.get('startDate').value); // to get value in input tag
  let enddate = moment(AC.get('endDate').value); // to get value in input tag
  if (enddate.isBefore(startdate, 'days')) {
    console.log('false');
    AC.get('endDate').setErrors({ earlierThanStartDate: true })
  } else {
    console.log('true');
    return null
  }
}