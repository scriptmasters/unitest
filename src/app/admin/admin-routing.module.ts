import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AdminComponent} from './admin.component';
import {GroupsComponent} from './groups/groups.component';
import {StudentsComponent} from './students/students.component';
import {QuestionsComponent} from './questions/questions.component';
import {FacultiesComponent} from './faculties/faculties.component';
import {AdministratorsComponent} from './administrators/administrators.component';
import {SubjectsComponent} from './subjects/subjects.component';
import {StatisticComponent} from './statistic/statistic.component';
import {TestDetailsComponent} from './testdetails/component/test-details.component';
import {TimetableComponent} from './timetable/timetable.component';
import {TestsComponent} from './subjects/tests/tests.component';
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
                component: StudentsComponent,
                resolve: {
                    students: StudentsResolver
                }
            },
            {
                path: 'students/byGroup/:id',
                component: StudentsComponent,
                resolve: {
                    students: StudentsResolver
                }
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
