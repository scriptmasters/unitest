import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student-routing.module';
import { AuthService } from '../auth/auth.service';
import { TestPlayerComponent } from './test-player/test-player.component';
import { TestPlayerService } from './services/test-player.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from './student.service';

@NgModule({
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [StudentComponent, TestPlayerComponent],
  providers: [AuthService, TestPlayerService, StudentService],
})
export class StudentModule { }
