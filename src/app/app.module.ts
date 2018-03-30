import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentsService } from './admin/students/students.service';

import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { StatisticComponent } from './admin/statistic/statistic.component';
import { FacultriesComponent } from './admin/facultries/facultries.component';
import { SubjectsComponent } from './admin/subjects/subjects.component';
import { SpecialitiesComponent } from './admin/specialities/specialities.component';
import { AdministratorsComponent } from './admin/administrators/administrators.component';
import { StudentsComponent } from './admin/students/students.component';
import { GroupsComponent } from './admin/groups/groups.component';
import { LoginComponent } from './login/login.component';
import { StudentRegistrationFormComponent } from './admin/students/student-registration-form/student-registration-form.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    StatisticComponent,
    FacultriesComponent,
    SubjectsComponent,
    SpecialitiesComponent,
    AdministratorsComponent,
    StudentsComponent,
    GroupsComponent,
    LoginComponent,
    StudentRegistrationFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    DataService,
    StudentsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
