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
  constructor(private service: StudentsService,
              private dialog: MatDialog,
              private router: Router) {
  }
  fakeData: IStudent[] = [{
    'gradebook_id': '',
    'group_id': '',
    'photo': '',
    'plain_password': '',
    'student_fname': '',
    'student_name': '',
    'student_surname': '',
    'user_id': ''
  }];
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IResolvedData> {
    const id = route.paramMap.get('id');
    this.fakeData[0].group_id = id;
    console.log('time');
    if (id) {
      console.log(id);
      return this.service.getStudentsByGroup(id).pipe(switchMap(
        data => {
          console.log(data);
          if (data.response === 'no records') {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: 'Немає зареєстрованих студентів в даній групі'
              }
            });
            // this.router.navigate(['admin/students']);
            console.log(1);
            return this.onDataRetrieve(this.fakeData, true, id);
          }
          console.log(2);
          return this.onDataRetrieve(data, true, id);
        }
      ));
    } else if (!id) {
      console.log(id);
      console.log(3);
      return this.service.countStudent().pipe(
        switchMap(data => this.service.getStudents(10, 0)),
        switchMap(response => this.onDataRetrieve(response, false))
      );
    }
  }

  onDataRetrieve(students: IStudent[], isByGroup: boolean, id?): Observable<IResolvedData> {
    const groupIDs: any[] = students.map(value => value.group_id);
    const body = JSON.stringify({entity: 'Group', ids: groupIDs});
    return this.service.getEntityValue(body).pipe(
      map(groups => {
        console.log('check ' + isByGroup);
        return {
          students: getFiltredStudents(students, groups),
          byGroup: isByGroup
        };
      })
    );
  }
}
