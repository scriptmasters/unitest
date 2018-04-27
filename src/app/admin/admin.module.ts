import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FacultiesService } from './faculties/faculties.service';
import { TestService } from './tests/test.service';
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
import { AdministratorsService } from './administrators/administrators.service';
import { FacultiesDialogComponent } from './faculties/faculties-dialog/faculties-dialog.component';
import { TestsComponent } from './tests/tests.component';
import { EditComponent } from './tests/edit/edit.component';
import { AddComponent } from './tests/add/add.component';
import { QuestionsComponent } from './questions/questions.component';
import { AddQuestionComponent } from './questions/add-question/add-question.component';
import { StatisticService } from './statistic/statistic.service';
import { SpecialityService } from './specialities/speciality.service';
import { PopupFormComponent } from './specialities/popup-form/popup-form.component';
import { SearchPipe } from './faculties/search.pipe';
import { TestsValidatorDirective } from './tests/tests-validator.directive';
import { AdministratorsDialogComponent } from './administrators/administrators-dialog/administrators-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule
    ],
    entryComponents: [
        FacultiesDialogComponent,
        EditComponent,
        AddComponent,
        PopupFormComponent,
        TestDetailCreateComponent, // Maryan
        AddQuestionComponent,
        AdministratorsDialogComponent
    ],
    declarations: [
        AdminComponent,
        StatisticComponent,
        FacultiesComponent,
        SpecialitiesComponent,
        AdministratorsComponent,
        FacultiesDialogComponent,
        TestsComponent,
        EditComponent,
        AddComponent,
        PopupFormComponent,
        TestDetailsComponent, // Maryan
        TestDetailCreateComponent,
        QuestionsComponent,
        AddQuestionComponent,
        TestsValidatorDirective,
        SearchPipe,
        AdministratorsDialogComponent
    ],
    providers: [
        AuthService,
        FacultiesService,
        TableService,
        TestService,
        StatisticService,
        SpecialityService,
        TestDetailsService,
        QuestionsService,
        AdministratorsService
    ]
})


export class AdminModule { }
