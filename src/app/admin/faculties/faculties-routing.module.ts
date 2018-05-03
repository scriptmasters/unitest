import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FacultiesComponent } from './faculties.component';

const routes: Routes = [
  {
    path: '',
    component: FacultiesComponent,
    data: {
          breadcrumb: "Факультети"
        }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FacultiesRoutingModule {}
