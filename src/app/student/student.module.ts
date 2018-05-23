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
import { DataService } from './services/data.service';
import { QuestionService } from './services/question.service';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ConfirmMessageTestComponent } from './test-player/modal/confirm-message-test/confirm-message-test.component';
import { AlertMessageTestComponent } from './test-player/modal/alert-message-test/alert-message-test.component';

@NgModule({
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    Ng2GoogleChartsModule
  ],
  declarations: [
    StudentComponent,
    TestPlayerComponent,
    TestResultComponent,
    QuizResultComponent,
    ConfirmMessageTestComponent,
    AlertMessageTestComponent
  ],
  providers: [AuthService, TestPlayerService, QuestionService, StudentService, TimerService, DataService],
  entryComponents: [TestResultComponent, ConfirmMessageTestComponent, AlertMessageTestComponent],
})
export class StudentModule { }
