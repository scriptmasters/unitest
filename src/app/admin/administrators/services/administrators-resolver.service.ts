import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Administrators } from '../administratorsInterface';
import { Observable } from 'rxjs/Observable';
import { AdministratorsService } from './administrators.service';

@Injectable()
     export class AdministratorsResolver implements Resolve<Administrators> {
       constructor(
        private service: AdministratorsService,
        private router: Router
        ) {}
        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      const administrators = this.service.getAdministrators();
      return administrators;
        }
     }
