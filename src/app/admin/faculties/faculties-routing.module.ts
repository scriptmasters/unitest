import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FacultiesResolver} from './services/faculties-resolver.service';
import {FacultiesComponent} from './faculties.component';

const routes: Routes = [
    {
        path: '',
        component: FacultiesComponent,
        resolve: {
            faculties: FacultiesResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FacultiesRoutingModule {
}
