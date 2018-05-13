import {Pipe, PipeTransform} from '@angular/core';
import {GroupsService} from '../groups.service';

@Pipe({
  name: 'specialityFilterPipe'
})
export class SpecialityFilterComponent implements PipeTransform {
  constructor() {
  }

  transform(table, value) {
    if (!value || value === 'Виберіть спецільність') {
      return table;
    }
    return table.filter(tab => {
      return tab.speciality.toLowerCase().includes(value.toLowerCase());
    });
  }

}
