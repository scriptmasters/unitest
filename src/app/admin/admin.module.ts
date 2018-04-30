import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FacultiesService } from './faculties/faculties.service';
import TableService from './timetable/timetable.service';
import { TestDetailsService } from './testdetails/sevices/test-details.service';
import { TestDetailsComponent } from './testdetails/component/test-details.component';
import { TestDetailCreateComponent } from './testdetails/modals/test-detail-create/test-detail-create.component';
import { QuestionsService } from './questions/questions.service';
import { AuthService} from '../auth/auth.service';
import { StatisticComponent } from './statistic/statistic.component';
import { FacultiesComponent } from './faculties/faculties.component';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { AdministratorsComponent } from './administrators/administrators.component';
import { FacultiesDialogComponent } from './faculties/faculties-dialog/faculties-dialog.component';
import { QuestionsComponent } from './questions/questions.component';
import { AddQuestionComponent } from './questions/add-question/add-question.component';
import { StatisticService } from './statistic/statistic.service';
import { SpecialityService } from './specialities/speciality.service';
import { PopupFormComponent } from './specialities/popup-form/popup-form.component';
import { SearchPipe } from './faculties/search.pipe';
import { SpecialityFilterComponent } from './groups/selectFilters/specialityFilter.component';
import {FacultyFilterComponent} from './groups/selectFilters/facultyFilter.component';
import { ResultsComponent } from './results/results.component';
import {ResultsService} from "./results/results.service";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule
    ],
    entryComponents: [
        FacultiesDialogComponent,
        PopupFormComponent,
        TestDetailCreateComponent,
        AddQuestionComponent
    ],
    declarations: [
        AdminComponent,
        StatisticComponent,
        FacultiesComponent,
        SpecialitiesComponent,
        AdministratorsComponent,
        FacultiesDialogComponent,
        PopupFormComponent,
        TestDetailsComponent,
        TestDetailCreateComponent,
        QuestionsComponent,
        AddQuestionComponent,
        SearchPipe,
        ResultsComponent
    ],
    providers: [
        AuthService,
        FacultiesService,
        TableService,
        StatisticService,
        SpecialityService,
        TestDetailsService,
        QuestionsService,
        ResultsService,
    ]
})


export class AdminModule { }
