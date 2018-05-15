import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'pagination'})
export class PaginationPipe implements PipeTransform {
    transform(array, size, index) {
        return array.slice(size * index, size * (index + 1));
    }
}
