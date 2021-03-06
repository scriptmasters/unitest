import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidatorFn} from '@angular/forms';

export function forbiddenCharValidator(nameRe: RegExp): ValidatorFn {
  return(control: AbstractControl): {[key: string]: any} => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenChar': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appTestsValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: TestsValidatorDirective, multi: true}]
})
export class TestsValidatorDirective {
  @Input() forbiddenChar: string;

  validate(control: AbstractControl): {[key: string]: any} {
    return this.forbiddenChar ? forbiddenCharValidator(new RegExp(this.forbiddenChar, 'i'))(control)
    : null;
 }

}
