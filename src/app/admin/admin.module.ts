import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from './admin.component';
import {AdminRoutingModule} from './admin-routing.module';
import {SharedModule} from '../shared/shared.module';
import {TableService} from './timetable/timetable.service';
import {TestDetailsService} from './testdetails/sevices/test-details.service';
import {TestDetailsComponent} from './testdetails/component/test-details.component';
import {TestDetailCreateComponent} from './testdetails/modals/test-detail-create/test-detail-create.component';
import {QuestionsService} from './questions/questions.service';
import {AuthService} from '../auth/auth.service';
import {StatisticComponent} from './statistic/statistic.component';
import {QuestionsComponent} from './questions/questions.component';
import {AddQuestionComponent} from './questions/add-question/add-question.component';
import {EditQuestionComponent} from './questions/edit-question/edit-question.component';
import {StatisticService} from './statistic/statistic.service';
import {FilterComponent} from './results/filter.component';
import {ResultsService} from './results/services/results.service';
import {ResultComponent} from './results/result/result.component';
import {FacultiesService} from './faculties/services/faculties.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
  }
import { TestResultGraphComponent } from './results/modals/test-result-graph/test-result-graph.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
    })
    ],
    entryComponents: [
        AddQuestionComponent,
        TestDetailCreateComponent,
        EditQuestionComponent,
        TestResultGraphComponent
    ],
    declarations: [
        AdminComponent,
        StatisticComponent,
        TestDetailsComponent,
        TestDetailCreateComponent,
        QuestionsComponent,
        AddQuestionComponent,
        EditQuestionComponent,
        FilterComponent,
        ResultComponent,
        TestResultGraphComponent
    ],
    providers: [
        AuthService,
        TableService,
        StatisticService,
        TestDetailsService,
        QuestionsService,
        ResultsService,
        FacultiesService
    ]
})

export class AdminModule {
}
