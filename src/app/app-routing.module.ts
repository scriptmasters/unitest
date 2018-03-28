import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

import { StatisticComponent } from './admin/statistic/statistic.component';
import { FacultriesComponent } from './admin/facultries/facultries.component';
import { SubjectsComponent } from './admin/subjects/subjects.component';
import { SpecialitiesComponent } from './admin/specialities/specialities.component';
import { AdministratorsComponent } from './admin/administrators/administrators.component';
import { StudentsComponent } from './admin/students/students.component';
import { GroupsComponent } from './admin/groups/groups.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'statistic',
        component: StatisticComponent,
        outlet: "adminNavigation"
      },
      {
        path: 'groups',
        component: GroupsComponent,
        outlet: "adminNavigation"
      },
      {
        path: 'students',
        component: StudentsComponent,
        outlet: "adminNavigation"
      },
      {
        path: 'facultries',
        component: FacultriesComponent,
        outlet: "adminNavigation"
      },
      {
        path: 'subjects',
        component: SubjectsComponent,
        outlet: "adminNavigation"
      },
      {
        path: 'specialities',
        component: SpecialitiesComponent,
        outlet: "adminNavigation"
      },      {
        path: 'administrators',
        component: AdministratorsComponent,
        outlet: "adminNavigation"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
