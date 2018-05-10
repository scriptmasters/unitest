import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubjectsComponent} from './subjects.component';

const routes: Routes = [
    {
        path: '',
        component: SubjectsComponent,
        data: {
            breadcrumb: 'Предмети'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubjectsRoutingModule {
}
