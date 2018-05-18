import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import IStudent from './interfaces/IStudent';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {StudentsService} from './students.service';
import {map, switchMap} from 'rxjs/operators';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {MatDialog} from '@angular/material';
import {getFiltredStudents} from './reusable-functions/get-filtred-students';
import IResolvedData from './interfaces/IResolvedData';

@Injectable()
export class StudentsResolver implements Resolve<IResolvedData> {
    constructor(
        private service: StudentsService,
        private dialog: MatDialog,
        private router: Router) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IResolvedData> {
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
                    return this.onDataRetrieve(data, true);
                }
            ));
        }
        if (!id) {
            return this.service.countStudent().pipe(
                switchMap(data => this.service.getStudents(10, 0)),
                switchMap(response => this.onDataRetrieve(response, false))
            );
        }
    }
    onDataRetrieve(students: IStudent[], isByGroup: boolean): Observable<IResolvedData> {
        const groupIDs: any[] = students.map(value => value.group_id);
        const body = JSON.stringify({entity: 'Group', ids: groupIDs});
        return this.service.getEntityValue(body).pipe(
            map(groups => {
                return {
                    students: getFiltredStudents(students, groups),
                    byGroup: isByGroup
                };
            })
        );
    }
}
