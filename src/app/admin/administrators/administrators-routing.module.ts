import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdministratorsResolver} from './services/administrators-resolver.service';
import {AdministratorsComponent} from './administrators.component';

const routes: Routes = [
  {
    path: '',
    component: AdministratorsComponent,
    resolve: {
        administrators: AdministratorsResolver
        },
    data: {
        breadcrumb: 'Адміністратори'
        }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdministratorsRoutingModule {}
