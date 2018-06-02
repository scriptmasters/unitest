import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student-routing.module';
import { AuthService } from '../auth/auth.service';
import { TestPlayerComponent } from './test-player/test-player.component';
import { TestPlayerService } from './services/test-player.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from './student.service';
import { SharedModule } from '../shared/shared.module';
import { TimerService } from './services/timer.service';
import { QuizResultComponent } from './test-player/quiz-result/quiz-result.component';
import { DataService } from './services/data.service';
import { QuestionService } from './services/question.service';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ConfirmMessageTestComponent } from './test-player/modal/confirm-message-test/confirm-message-test.component';
import { AlertMessageTestComponent } from './test-player/modal/alert-message-test/alert-message-test.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    Ng2GoogleChartsModule,
    HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
    })
  ],
  declarations: [
    StudentComponent,
    TestPlayerComponent,
    QuizResultComponent,
    ConfirmMessageTestComponent,
    AlertMessageTestComponent,
  ],
  providers: [
    AuthService,
    TestPlayerService,
    QuestionService,
    StudentService,
    TimerService,
    DataService,
  ],
  entryComponents: [
    ConfirmMessageTestComponent,
    AlertMessageTestComponent,
  ],
})
export class StudentModule {}
