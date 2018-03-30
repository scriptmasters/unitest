import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

import { StatisticComponent } from './admin/statistic/statistic.component';
import { FacultiesComponent } from './admin/faculties/faculties.component';
import { SubjectsComponent } from './admin/subjects/subjects.component';
import { SpecialitiesComponent } from './admin/specialities/specialities.component';
import { AdministratorsComponent } from './admin/administrators/administrators.component';
import { StudentsComponent } from './admin/students/students.component';
import { GroupsComponent } from './admin/groups/groups.component';
import { LoginComponent } from './login/login.component';
import { TimetableComponent } from './admin/timetable/timetable.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'statistic',
        component: StatisticComponent
      },
      {
        path: 'groups',
        component: GroupsComponent
      },
      {
        path: 'students',
        component: StudentsComponent
      },
      {
        path: 'facultries',
        component: FacultiesComponent
      },
      {
        path: 'subjects',
        component: SubjectsComponent
      },
      {
        path: 'specialities',
        component: SpecialitiesComponent
      },      {
        path: 'administrators',
        component: AdministratorsComponent
      },
      {
        path: 'timetable',
        component: TimetableComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
