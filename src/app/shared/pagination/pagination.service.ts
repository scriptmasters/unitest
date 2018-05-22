import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class PaginationService {
    fullLength: number;
    paginatedLength: number;
    entity: string;
    private count = 0;
    progressbar = new BehaviorSubject(false);
    pagSubscr = new BehaviorSubject(true);
    emptySubscr = new BehaviorSubject(true);

    constructor(public http: HttpClient) {
    }

    setReqCountDefault() {
        this.count = 0;
    }

    increaseReqCount() {
        if (this.count === 0) {
            this.progressbar.next(true);
        }
        this.count++;
    }

    decreaseReqCount() {
        if (this.count === 1) {
            this.progressbar.next(false);
        }
        this.count--;
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
