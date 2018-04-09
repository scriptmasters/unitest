import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {CdkTableModule} from '@angular/cdk/table';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './shared/auth/auth.service';
import {StudentsService} from './admin/students/students.service';
import { SubjectService } from './admin/subjects/services/subject.service';
import {AuthGuard} from './auth-guard.service';

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

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
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
import { EditSubjectComponent } from './admin/subjects/edit-subject/edit-subject.component';
import { AddSubjectComponent } from './admin/subjects/add-subject/add-subject.component';

import {StatisticService} from '../app/admin/statistic/statistic.service';
import {SpecialityService} from '../app/admin/specialities/speciality.service';
import { PopupFormComponent } from './admin/specialities/popup-form/popup-form.component';

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
    entryComponents: [AppComponent, AddSubjectComponent, EditSubjectComponent,PopupFormComponent],
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
        StudentRegistrationFormComponent,
        AddSubjectComponent,
        PopupFormComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        AuthService,
        StudentsService,
        SubjectService,
        AuthGuard,
        StatisticService,
        SpecialityService
    ]
})

export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);

