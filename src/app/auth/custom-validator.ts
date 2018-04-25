import { AbstractControl, ValidatorFn} from '@angular/forms';

export function SymbolValidator(wrongSymb: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        const forbidden = control.value.indexOf(wrongSymb);
        return forbidden === -1 ? null : {'forbiddenSymbol': {value: control.value}};
    };
}
