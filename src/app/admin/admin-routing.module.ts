import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './admin.component';
import {GroupsComponent} from './groups/groups.component';
import {AddQuestionComponent} from './questions/add-question/add-question.component';
import {QuestionsComponent} from './questions/questions.component';
import {FacultiesComponent} from './faculties/faculties.component';
import {AdministratorsComponent} from './administrators/administrators.component';
import {StatisticComponent} from './statistic/statistic.component';
import {TestDetailsComponent} from './testdetails/component/test-details.component';
import {TimetableComponent} from './timetable/timetable.component';
import {TestsComponent} from './tests/tests.component';
import {SpecialitiesComponent} from './specialities/specialities.component';
import { StudentsResolver } from './students/students-resolver.service';


const routes: Routes = [
    {
        path: '',
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
                loadChildren: './students/students.module#StudentsModule'
            },
            {
                path: 'students/byGroup',
                loadChildren: './students/students.module#StudentsModule'
            },
            {
                path: 'faculties',
                component: FacultiesComponent
            },
            {
                path: 'subjects',
                loadChildren: './subjects/subjects.module#SubjectsModule'
            },
            {
                path: 'specialities',
                component: SpecialitiesComponent
            }, {
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
                path: 'add-question',
                component: AddQuestionComponent
            },
            {
                path: 'testdetails',
                component: TestDetailsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }
