import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import TableService from './timetable/timetable.service';
import { TestDetailsService } from './testdetails/sevices/test-details.service';
import { TestDetailsComponent } from './testdetails/component/test-details.component';
import { TestDetailCreateComponent } from './testdetails/modals/test-detail-create/test-detail-create.component';
import { QuestionsService } from './questions/questions.service';
import { AuthService} from '../auth/auth.service';
import { StatisticComponent } from './statistic/statistic.component';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { AdministratorsComponent } from './administrators/administrators.component';
import { AdministratorsService } from './administrators/administrators.service';
import { QuestionsComponent } from './questions/questions.component';
import { AddQuestionComponent } from './questions/add-question/add-question.component';
import { StatisticService } from './statistic/statistic.service';
import { SpecialityService } from './specialities/speciality.service';
import { PopupFormComponent } from './specialities/popup-form/popup-form.component';
import { SpecialityFilterComponent } from './groups/selectFilters/specialityFilter.component';
import { AdministratorsDialogComponent } from './administrators/administrators-dialog/administrators-dialog.component';
import { ResultsComponent } from './results/results.component';
import { ResultsService } from './results/services/results.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule
    ],
    entryComponents: [
        PopupFormComponent,
        AddQuestionComponent,
        AdministratorsDialogComponent,
        TestDetailCreateComponent,
        AddQuestionComponent
    ],
    declarations: [
        AdminComponent,
        StatisticComponent,
        SpecialitiesComponent,
        AdministratorsComponent,
        PopupFormComponent,
        TestDetailsComponent,
        TestDetailCreateComponent,
        QuestionsComponent,
        AddQuestionComponent,
        SpecialityFilterComponent,
        AdministratorsDialogComponent,
        ResultsComponent
    ],
    providers: [
        AuthService,
        TableService,
        StatisticService,
        SpecialityService,
        TestDetailsService,
        QuestionsService,
        AdministratorsService,
        ResultsService
    ]
})


export class AdminModule { }
