import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import IStudent from './interfaces/IStudent';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { StudentsService } from './students.service';
import IGroup from './interfaces/IGroup';
import { switchMap } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { MatDialog } from '@angular/material';
import { mergeMap } from 'rxjs/operators';
import { getFiltredStudents } from './reusable-functions/get-filtred-students';

@Injectable()
export class StudentsResolver implements Resolve<IStudent[]> {
    constructor(
        private service: StudentsService,
        private dialog: MatDialog,
        private router: Router) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStudent[]> {
        const id = route.paramMap.get('id');
        if (id) {
            return this.service.getStudentsByGroup(id).pipe(switchMap(
                data => {
                    if (data.response === 'no records') {
                        this.dialog.open(ResponseMessageComponent, {
                            width: '400px',
                            data: {
                                message: 'Немає зареєстрованих студентів в даній групі'
                            }
                        });
                        this.router.navigate(['admin/groups/']);
                        return new ErrorObservable('Немає зареєстрованих студентів в даній групі');
                    }
                    return this.onDataRetrieve(data);
                }
            ));
        }
        if (!id) {
            return this.service.countStudent().pipe(
                mergeMap(data => this.service.getStudents(data.numberOfRecords).pipe(
                    switchMap(response => this.onDataRetrieve(response)))
            ));
        }
    }
    onDataRetrieve(data: IStudent[]): Observable<IStudent[]> {
        const groupsArr: any[] = data.map(value => value.group_id);
        const body = JSON.stringify({entity: 'Group', ids: groupsArr});
        return this.service.getEntityValue(body).pipe(switchMap(
            response => {
                return this.processingData(data, response);
            }
        ));
    }
    processingData(response: IStudent[], groups: IGroup[]): Observable<IStudent[]> {
        return Observable.of(getFiltredStudents(response, groups));
    }
}
