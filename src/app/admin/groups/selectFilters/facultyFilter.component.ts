import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'facultyFilterPipe'
})
export class FacultyFilterComponent implements PipeTransform {
  constructor() {
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
