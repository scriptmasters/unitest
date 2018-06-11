import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {ModalSubjectComponent} from './modal-subject/modal-subject.component';
import {SubjectsComponent} from './subjects.component';
import {SubjectService} from './services/subject.service';
import {SubjectsRoutingModule} from './subjects-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
  }

@NgModule({
    declarations: [SubjectsComponent, ModalSubjectComponent],
    imports: [CommonModule, SharedModule, SubjectsRoutingModule,
        TranslateModule.forChild({
            loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory,
                deps: [HttpClient]},
            isolate: false
        })
    ],
    providers: [SubjectService],
    entryComponents: [ModalSubjectComponent],
})
export class SubjectsModule {
}
