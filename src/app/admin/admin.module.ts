import { FacultyFilterComponent } from './groups/selectFilters/facultyFilter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { StudentsService } from './students/students.service';
import { FacultiesService } from './faculties/faculties.service';
import { TestService } from './tests/test.service';
import { GroupsService } from './groups/groups.service';
import TableService from './timetable/timetable.service';
import { TestDetailsService } from './testdetails/sevices/test-details.service';
import { TestDetailsComponent } from './testdetails/component/test-details.component';
import { TestDetailCreateComponent } from './testdetails/modals/test-detail-create/test-detail-create.component';
import { QuestionsService } from './questions/questions.service';
import { AuthService } from '../auth/auth.service';
import { StudentsComponent } from './students/students.component';
import { StatisticComponent } from './statistic/statistic.component';
import { FacultiesComponent } from './faculties/faculties.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { ModalSubjectComponent } from './subjects/modal-subject/modal-subject.component';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { AdministratorsComponent } from './administrators/administrators.component';
import { GroupsComponent } from './groups/groups.component';
import { TimetableComponent } from './timetable/timetable.component';
import { FacultiesDialogComponent } from './faculties/faculties-dialog/faculties-dialog.component';
import { TimeTableModal } from './timetable/timetable-modal/timetable-modal.component';
import { TimetableDeleteConfirmComponent } from './timetable/timetable-delete-confirm/timetable-delete-confirm.component';
import { TestsComponent } from './tests/tests.component';
import { EditComponent } from './tests/edit/edit.component';
import { AddComponent } from './tests/add/add.component';
import { DialogComponent } from './groups/dialog/dialog.component';
import { GroupsDeleteConfirmComponent } from './groups/groups-delete-confirm/groups-delete-confirm.component';
import { QuestionsComponent } from './questions/questions.component';
import { AddQuestionComponent } from './questions/add-question/add-question.component';
import { StatisticService } from './statistic/statistic.service';
import { SpecialityService } from './specialities/speciality.service';
import { PopupFormComponent } from './specialities/popup-form/popup-form.component';
import { DeleteConfirmComponent } from '../shared/delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from '../shared/response-message/response-message.component';
import { StudentsResolver } from './students/students-resolver.service';
import { SearchPipe } from './faculties/search.pipe';
import { TestsValidatorDirective } from './tests/tests-validator.directive';
import { SpecialityPipe } from './specialities/speciality.pipe';
import { SpecialityFilterComponent } from './groups/selectFilters/specialityFilter.component';

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
        DialogComponent,
        GroupsDeleteConfirmComponent,
        TestDetailCreateComponent, // Maryan
        AddQuestionComponent
    ],
    declarations: [
        AdminComponent,
        StatisticComponent,
        FacultiesComponent,
        SpecialitiesComponent,
        AdministratorsComponent,
        GroupsComponent,
        DialogComponent,
        FacultiesDialogComponent,
        TestsComponent,
        EditComponent,
        AddComponent,
        GroupsDeleteConfirmComponent,
        PopupFormComponent,
        TestDetailsComponent, // Maryan
        TestDetailCreateComponent,
        QuestionsComponent,
        AddQuestionComponent,
        TestsValidatorDirective,
        SearchPipe,
        SpecialityPipe,
        SpecialityFilterComponent,
        FacultyFilterComponent
    ],
    providers: [
        AuthService,
        FacultiesService,
        TableService,
        TestService,
        StatisticService,
        SpecialityService,
        GroupsService,
        TestDetailsService,
        QuestionsService,
    ]
})

export class AdminModule { }
