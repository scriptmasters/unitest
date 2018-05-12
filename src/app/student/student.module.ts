import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student-routing.module';
import { AuthService } from '../auth/auth.service';
import { TestPlayerComponent } from './test-player/test-player.component';
import { TestPlayerService } from './services/test-player.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from './student.service';
import { TestResultComponent } from './test-player/test-result/test-result.component';
import { SharedModule } from '../shared/shared.module';
import { TimerService } from './services/timer.service';
import { QuizResultComponent } from './test-player/quiz-result/quiz-result.component';

@NgModule({
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [StudentComponent, TestPlayerComponent, TestResultComponent, QuizResultComponent],
  providers: [AuthService, TestPlayerService, StudentService, TimerService],
  entryComponents: [TestResultComponent],
})
export class StudentModule {}
