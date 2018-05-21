import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';



@Injectable()
export class PaginationService {
    fullLength: number;
    paginatedLength: number;
    entity: string;
    collectionNotEmpty = true;
    count = 0;
    progressbar = new BehaviorSubject(this.count);
    pagSubscr = new BehaviorSubject(true);

    constructor(public http: HttpClient) {
    }

    getSearchedEntities(searchString) {
        return this.http.get(`${this.entity}/getRecordsBySearch/${searchString}`);
    }

    countEntities() {
        return this.http.get(`${this.entity}/countRecords`);
    }

    getEntitiesRange(limit, offset) {
        return this.http.get(`${this.entity}/getRecordsRange/${limit}/${offset}`);
    }
}
