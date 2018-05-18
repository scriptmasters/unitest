import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Faculties} from '../facultiesInterface';
import {Observable} from 'rxjs/Observable';
import {FacultiesService} from './faculties.service';

@Injectable()
     export class FacultiesResolver implements Resolve<Faculties> {
       constructor(
        private service: FacultiesService,
        ) {}
        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      const faculties = this.service.getFaculties();
      return faculties;
        }
     }
