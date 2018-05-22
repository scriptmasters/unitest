import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import {
  Router,
  RouterModule,
  ActivatedRoute,
  NavigationEnd,
  Params,
  PRIMARY_OUTLET
} from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit, OnChanges, OnDestroy {
  prefix = '';
  private routesFriendlyNames: Map<string, string> = new Map<string, string>();
  public _urls: string[];
  public _routerSubscription: any;

  constructor(private router: Router) {
    this.routesFriendlyNames.set('/admin', 'Головна');
    this.routesFriendlyNames.set('/admin/statistic', 'Статистика');
    this.routesFriendlyNames.set('/admin/groups', 'Групи');
    this.routesFriendlyNames.set('/admin/students', 'Студенти');
    this.routesFriendlyNames.set('/admin/students/byGroup', 'Студенти групи');
    this.routesFriendlyNames.set('/admin/faculties', 'Факультети');
    this.routesFriendlyNames.set('/admin/subjects', 'Предмети');
    this.routesFriendlyNames.set('/admin/specialities', 'Спеціальності');
    this.routesFriendlyNames.set('/admin/administrators', 'Адміністратори');
    this.routesFriendlyNames.set('/admin/timetable', 'Розклад');
    this.routesFriendlyNames.set('/admin/results', 'Результати');
    this.routesFriendlyNames.set('/admin/subjects/tests', 'Тести');
    this.routesFriendlyNames.set('/admin/subjects/tests/questions', 'Завдання');
    this.routesFriendlyNames.set('/admin/subjects/tests/testdetails', 'Деталі тесту');
    this._urls = new Array();

    if (this.prefix.length > 0) {
      this._urls.unshift(this.prefix);
    }
    this._routerSubscription = this.router.events.subscribe(
      (navigationEnd: NavigationEnd) => {
        if (navigationEnd instanceof NavigationEnd) {
          this._urls.length = 0; // Fastest way to clear out array
          this.generateBreadcrumbTrail(
            navigationEnd.urlAfterRedirects
              ? navigationEnd.urlAfterRedirects
              : navigationEnd.url
          );
        }
      }
    );
  }
  ngOnInit(): void {}
  ngOnChanges(changes: any): void {
    if (!this._urls) {
      return;
    }
    this._urls.length = 0;
    this.generateBreadcrumbTrail(this.router.url);
  }
  generateBreadcrumbTrail(url: string): void {
    this._urls.unshift(url);

    if (url.lastIndexOf('/') > 0) {
      this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/'))); // Find last '/' and add everything before it as a parent route
    } else if (this.prefix.length > 0) {
      this._urls.unshift(this.prefix);
    }
  }
  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }
  friendlyName(url: string): string {
    return !url ? '' : this.getFriendlyNameForRoute(url);
  }
  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }
  /**
   *  Show the friendly name for a given route (url). If no match is found the url (without the leading '/') is shown.
   *
   * @param route
   * @returns {*}
   */
  getFriendlyNameForRoute(route: string): string {
    const routeEnd = route.substr(route.lastIndexOf('/') + 1, route.length);
    let name: string = routeEnd;

    this.routesFriendlyNames.forEach((value, key, map) => {
      if (new RegExp(key).exec(route)) {
        name = value;
      }
    });
    return name;
  }
}
