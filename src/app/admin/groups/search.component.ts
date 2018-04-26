import {Pipe, PipeTransform} from '@angular/core';
import {GroupsService} from './groups.service';

@Pipe({
  name: 'search'
})
export class SearchFilter implements PipeTransform {
  constructor(private groupsService: GroupsService) {
  }

  transform(table, value) {
    if (!value) {
      return table;
    }
    return table.filter(tab => {
      return tab.group.toLowerCase().includes(value.toLowerCase());
    });
  }

  // changeFilter() {
  //   this.groupsService.changeSearchFilter('');
  // }

}
