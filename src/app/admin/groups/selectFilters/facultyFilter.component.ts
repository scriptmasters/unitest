import {Pipe, PipeTransform} from '@angular/core';
import {GroupsComponent} from '../groups.component';

@Pipe({
  name: 'facultyFilterPipe'
})
export class FacultyFilterComponent implements PipeTransform {
  constructor(private gr: GroupsComponent) {
  }

  transform(table, value) {
    if (!value || value === 'Виберіть факультет') {

      return table;
    }

    return table.filter(tab => {
      return tab.faculty.toLowerCase().includes(value.toLowerCase());
    });
  }

}
