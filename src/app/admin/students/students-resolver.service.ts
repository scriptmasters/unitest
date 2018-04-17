import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import IStudent from './interfaces/IStudent';
import { Observable } from 'rxjs/Observable';
import { StudentsService } from './students.service';

@Injectable()
export class StudentsResolver implements Resolve<IStudent[]> {
    constructor(private service: StudentsService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStudent[]> {
        const id = route.paramMap.get('id');
        if (id) {
            return this.service.getStudentsByGroup(id);
        }
        if (!id) {
            return this.service.getStudents();
        }
    }
}
