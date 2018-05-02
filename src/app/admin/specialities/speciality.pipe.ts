import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'specialitySearch'
})
export class SpecialityPipe implements PipeTransform {

  // transform(speciality: any, value: any): any {
  //   return speciality.filter(user => {
  //     return user.speciality_name.includes(value);
  //   });
  // }
  transform(specialityPipe: any[], value: any): any[] {
    if (!value) { return specialityPipe; }
    return specialityPipe.filter(speciality => {
      return speciality.speciality_name.toLowerCase().includes(value.toLowerCase());
    });
  }
}
