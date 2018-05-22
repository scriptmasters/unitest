import {Pipe, PipeTransform} from '@angular/core';
import {PaginationService} from './pagination.service';

@Pipe({
    name: 'pagination',
    pure: false
})
export class PaginationPipe implements PipeTransform {
    constructor(private pagService: PaginationService) {
    }

    transform(array, size, index) {

        this.pagService.fullLength = array.length;
        const outputArr = array.slice(size * index, size * (index + 1));
        this.pagService.paginatedLength = outputArr.length;
        if (array.length === 0) {
            this.pagService.emptySubscr.next(true);
            this.pagService.pagSubscr.next(false);
        } else {
            this.pagService.emptySubscr.next(false);

            if (array.length <= size) {
                this.pagService.pagSubscr.next(false);
                return array;
            } else {
                this.pagService.pagSubscr.next(true);
                return outputArr;
            }
        }
    }
}
