import {Pipe, PipeTransform} from '@angular/core';
import {GroupsService} from '../groups.service';

@Pipe({
  name: 'specialityFilterPipe'
})
export class SpecialityFilterComponent implements PipeTransform {
  constructor(private groupsService: GroupsService) {
  }

  transform(table, value) {
    if (!value || value === 'Виберіть спецільність') {
      return table;
    }
    return table.filter(tab => {
      // this.changeFilter();
      return tab.speciality.toLowerCase().includes(value.toLowerCase());
    });
  }

  // changeFilter() {
  //   this.groupsService.changeSearchFilter('');
  // }
}
