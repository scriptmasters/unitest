import { NgModule } from '@angular/core';
import { StudentsComponent } from './students.component';
import { StudentRegistrationFormComponent } from './student-registration-form/student-registration-form.component';
import { StudentEditFormComponent } from './student-edit-form/student-edit-form.component';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsService } from './students.service';
import { SearchStudentPipe } from './searchStudent.pipe';
import { SharedModule } from '../../shared/shared.module';
import { StudentsResolver } from './students-resolver.service';
import { CommonModule } from '@angular/common';
import { StudentsModalWindowComponent } from './students-modal-window/students-modal-window.component';

@NgModule({
    declarations: [
        StudentsComponent,
        StudentRegistrationFormComponent,
        StudentEditFormComponent,
        SearchStudentPipe,
        StudentsModalWindowComponent
    ],
    imports: [
        CommonModule,
        StudentsRoutingModule,
        SharedModule
    ],
    providers: [
        StudentsService,
        StudentsResolver
    ],
    entryComponents: [
        StudentEditFormComponent,
        StudentRegistrationFormComponent
    ]
})

export class StudentsModule {}
