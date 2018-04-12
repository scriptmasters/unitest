import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {CdkTableModule} from '@angular/cdk/table';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './shared/auth/auth.service';
import {StudentsService} from './admin/students/students.service';
import { EditSubjectComponent } from './admin/subjects/edit-subject/edit-subject.component';
import { AddSubjectComponent } from './admin/subjects/add-subject/add-subject.component';
import {FacultiesService} from './admin/faculties/faculties.service';
import {StudentGuard} from './student-guard.service';
import {AdminGuard} from './admin-guard.service';
import {AuthErrorPopupComponent} from './shared/auth/auth-error-popup/auth-error-popup.component';
import {SubjectService} from './admin/subjects/services/subject.service';
import {NgxPaginationModule} from 'ngx-pagination';
import {TestService} from './admin/subjects/tests/test.service';
import { GroupsService } from './admin/groups/groups.service';
import TableService from './admin/timetable/timetable.service';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AuthComponent } from './shared/auth/auth.component';
import { AdminComponent } from './admin/admin.component';
import { StudentsComponent } from './admin/students/students.component';
import { StudentComponent } from './student/student.component';
import { StatisticComponent } from './admin/statistic/statistic.component';
import { FacultiesComponent } from './admin/faculties/faculties.component';
import { SubjectsComponent } from './admin/subjects/subjects.component';
import { SpecialitiesComponent } from './admin/specialities/specialities.component';
import { AdministratorsComponent } from './admin/administrators/administrators.component';
import { StudentRegistrationFormComponent } from './admin/students/student-registration-form/student-registration-form.component';
import { GroupsComponent } from './admin/groups/groups.component';
import { TimetableComponent } from './admin/timetable/timetable.component';
import { StudentEditFormComponent } from './admin/students/student-edit-form/student-edit-form.component';
import { StudentDeleteConfirmComponent } from './admin/students/student-delete-confirm/student-delete-confirm.component';
import { ResponseMessageComponent } from './shared/response-message/response-message.component';
import { FacultiesAddComponent } from './admin/faculties/faculties-add/faculties-add.component';
import { FacultiesUpdateComponent } from './admin/faculties/faculties-update/faculties-update.component';
import { FacultiesDeleteComponent } from './admin/faculties/faculties-delete/faculties-delete.component';
import { TimeTableModal } from './admin/timetable/timetable-modal/timetable-modal.component';
import { TimetableDeleteConfirmComponent } from './admin/timetable/timetable-delete-confirm/timetable-delete-confirm.component';
import {TestsComponent} from './admin/subjects/tests/tests.component';
import { EditComponent } from './admin/subjects/tests/edit/edit.component';
import { AddComponent } from './admin/subjects/tests/add/add.component';
import { DialogComponent } from './admin/groups/dialog/dialog.component';
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        CdkTableModule,
        NgxPaginationModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule
    ],
    entryComponents: [
        AppComponent,
        AddSubjectComponent,
        EditSubjectComponent,
        AuthErrorPopupComponent,
        TimeTableModal,
        StudentRegistrationFormComponent,
        StudentEditFormComponent,
        StudentDeleteConfirmComponent,
        AuthErrorPopupComponent,
        ResponseMessageComponent,
        TimeTableModal,
        TimetableDeleteConfirmComponent,
        FacultiesAddComponent,
        FacultiesUpdateComponent,
        FacultiesDeleteComponent,
        EditComponent,
        AddComponent,
        DialogComponent
    ],
    declarations: [
        AppComponent,
        AuthComponent,
        AdminComponent,
        StudentComponent,
        StatisticComponent,
        FacultiesComponent,
        SubjectsComponent,
        EditSubjectComponent,
        SpecialitiesComponent,
        AdministratorsComponent,
        StudentsComponent,
        GroupsComponent,
        TimetableComponent,
        TimeTableModal,
        StudentRegistrationFormComponent,
        AddSubjectComponent,
        TimeTableModal,
        AuthErrorPopupComponent,
        TimetableDeleteConfirmComponent,
        DialogComponent,
        TimeTableModal,
        AuthErrorPopupComponent,
        StudentEditFormComponent,
        StudentDeleteConfirmComponent,
        FacultiesAddComponent,
        FacultiesUpdateComponent,
        FacultiesDeleteComponent,
        AuthErrorPopupComponent,
        ResponseMessageComponent,
        TestsComponent,
        EditComponent,
        AddComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        AuthService,
        StudentsService,
        SubjectService,
        AdminGuard,
        StudentGuard,
        FacultiesService,
        TableService,
        TestService, 
        GroupsService
    ]
})

export class AppModule {}

