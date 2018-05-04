import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students.component';
import { StudentsResolver } from './students-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent,
    data: {
      breadcrumb: 'Студенти'
    },
    resolve: {
      resolvedStudents: StudentsResolver
    }
  },
  {
    path: ':id',
    component: StudentsComponent,
    data: {
      breadcrumb: 'Студенти групи'
    },
    resolve: {
      resolvedStudents: StudentsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule {}
