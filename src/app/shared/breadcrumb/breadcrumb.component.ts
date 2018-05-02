import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { BreadCrumb } from './breadcrumb';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: [ './breadcrumb.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
    breadcrumbs = this.router.events
        .filter(event => event instanceof NavigationEnd)
        .distinctUntilChanged()
        .map(event => this.buildBreadCrumb(this.activatedRoute.root));
    // Build your breadcrumb starting with the root route of your current activated route
    constructor(private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
    }

    buildBreadCrumb(route: ActivatedRoute, url: string = '',
                    breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {
        // If no routeConfig is avalailable we are on the root path
        const label = route.routeConfig ? route.routeConfig.data[ 'breadcrumb' ] : 'Home';
        const path = route.routeConfig ? route.routeConfig.path : '';
        // In the routeConfig the complete path is not available,
        // so we rebuild it each time
        const nextUrl = `${url}${path}/`;
        const breadcrumb = {
            label: label,
            url: nextUrl
        };
        const newBreadcrumbs = [ ...breadcrumbs, breadcrumb ];
        if (route.firstChild) {
            // If we are not on our current path yet,
            // there will be more children to look after, to build our breadcumb
            return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
        }
        return newBreadcrumbs;
    }
}
