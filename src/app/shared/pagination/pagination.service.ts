import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/take';


@Injectable()
export class PaginationService {
    fullLength: number;
    paginatedLength: number;
    entity: string;
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
