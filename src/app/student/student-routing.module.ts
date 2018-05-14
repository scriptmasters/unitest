import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentComponent } from './student.component';
import { TestPlayerComponent } from './test-player/test-player.component';
import { QuizResultComponent } from './test-player/quiz-result/quiz-result.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
  },
  {
    path: 'test/:id',
    component: TestPlayerComponent,
  },
  {
    path: 'results',
    component: QuizResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
