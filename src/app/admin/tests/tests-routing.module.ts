import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestsComponent } from './tests.component';

const routes: Routes = [
    {
        path: '',
        component: TestsComponent,
        data: {
            breadcrumb: 'Тести'
              }   
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TestsRoutingModule {

}
