import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student-routing.module';
import { AuthService } from '../auth/auth.service';

@NgModule({
    imports: [
        CommonModule,
        StudentRoutingModule
    ],
    declarations: [StudentComponent],
    providers: [AuthService]
})
export class StudentModule { }
