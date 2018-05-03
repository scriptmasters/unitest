import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentComponent } from './student.component';
import { TestPlayerComponent } from './test-player/test-player.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
  },
  {
    path: 'test/:id',
    component: TestPlayerComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
