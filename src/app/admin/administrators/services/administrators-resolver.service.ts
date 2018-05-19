import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Administrators} from '../administratorsInterface';
import {Observable} from 'rxjs/Observable';
import {AdministratorsService} from './administrators.service';

@Injectable()
     export class AdministratorsResolver implements Resolve<Administrators> {
       constructor(
        private service: AdministratorsService
        ) {}
        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      const administrators = this.service.getAdministrators();
      return administrators;
        }
     }
