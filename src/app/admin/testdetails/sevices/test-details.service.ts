import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class TestDetailsService {

    constructor(private http: HttpClient, public snackBar: MatSnackBar) {
    }

    openTooltip(message) {
        this.snackBar.open(`${message}`, 'OK', {
            duration: 2000
        });
    }

    getTestDetails(testId) {
        const url = 'testDetail/getTestDetailsByTest/' + testId;
        return this.http.get(url);
    }

    addNewTestDetail(testDetail) {
        const url = 'testDetail/insertData';
        return this.http.post(url, testDetail);
    }

    editTestDetail(testDetail) {
        const url = 'testDetail/update/' + testDetail.id;
        return this.http.post(url, testDetail);
    }

    deleteTestDetail(id) {
        const url = 'testDetail/del/' + id;
        return this.http.delete(url);
    }

    getTestById(testId) {
        const url = 'test/getRecords/' + testId;
        return this.http.get(url);
    }

}
