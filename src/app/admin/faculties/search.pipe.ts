import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'search'
})

export class SearchPipe implements PipeTransform {
  transform(faculties: any[], filterQuery: any): any[] {
    if (!filterQuery) return faculties;
        return faculties.filter(faculties => {
            return faculties.faculty_name.toLowerCase().includes(filterQuery.toLowerCase());
        })
  }
}
