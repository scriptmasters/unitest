import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Faculties } from '../facultiesInterface';
import { Observable } from 'rxjs/Observable';
import { FacultiesService } from './faculties.service';

@Injectable()
     export class FacultiesResolver implements Resolve<Faculties> {
       constructor(
        private service: FacultiesService,
        private router: Router
        ) {}
        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      const faculties = this.service.getFaculties();
      return faculties;
        }
     }
