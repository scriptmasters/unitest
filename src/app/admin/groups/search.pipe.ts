import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'search',
    pure: false
})
export class SearchFilterPipe implements PipeTransform {
    constructor() {
    }
    transform(table, value) {
        if (!value) {
            return table;
        }
        return table.filter(tab => {
            return tab.group.toLowerCase().includes(value.toLowerCase());
        });
    }
}
