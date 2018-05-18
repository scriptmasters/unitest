import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'search'
})
export class SearchFilter implements PipeTransform {
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
