import {Pipe, PipeTransform} from '@angular/core';
import {GroupsService} from '../groups.service';

@Pipe({
  name: 'facultyFilterPipe'
})
export class FacultyFilterComponent implements PipeTransform {
  constructor(private groupsService: GroupsService) {
  }

  transform(table, value) {
    if (!value || value === 'Виберіть факультет') {
      return table;
    }
    return table.filter(tab => {
      // this.changeFilter();
      return tab.faculty.toLowerCase().includes(value.toLowerCase());
    });
  }

  // changeFilter() {
  //   this.groupsService.changeSearchFilter('');
  // }
}
