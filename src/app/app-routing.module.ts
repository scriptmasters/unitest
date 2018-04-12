import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { AdminComponent } from './admin/admin.component';
import { AuthComponent } from './shared/auth/auth.component';
import { StudentGuard } from './student-guard.service';
import { AdminGuard } from './admin-guard.service';
import { FacultiesComponent } from './admin/faculties/faculties.component';
import { TestsComponent } from './admin/subjects/tests/tests.component';
import { StatisticComponent } from './admin/statistic/statistic.component';
import { SubjectsComponent } from './admin/subjects/subjects.component';
import { SpecialitiesComponent } from './admin/specialities/specialities.component';
import { AdministratorsComponent } from './admin/administrators/administrators.component';
import { StudentsComponent } from './admin/students/students.component';
import { GroupsComponent } from './admin/groups/groups.component';
import { TimetableComponent } from './admin/timetable/timetable.component';
import { QuestionsComponent } from './admin/questions/questions.component';
import { TestDetailsComponent} from './admin/testdetails/component/test-details.component';


const routes: Routes = [
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: 'student', canActivate: [StudentGuard], component: StudentComponent },
    { path: 'login', component: AuthComponent },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuard],
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
            path: 'students/byGroup/:id',
            component: StudentsComponent
          },
          {
            path: 'faculties',
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
          },
          {
            path: 'tests',
            component: TestsComponent
          },
          {
            path: 'questions',
            component: QuestionsComponent
          },
          {
            path: 'testdetails',
            component: TestDetailsComponent
          }
        ]
    }
    // { path: '**', redirectTo: '/admin', pathMatch: 'full' }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
