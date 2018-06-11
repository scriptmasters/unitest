import {NgModule} from '@angular/core';
import {TimetableComponent} from './timetable.component';
import {TimeTableModalComponent} from './timetable-modal/timetable-modal.component';
import {TimetableDeleteConfirmComponent} from './timetable-delete-confirm/timetable-delete-confirm.component';
import {TimetableRoutingModule} from './timetable-routing.module';
import {TableService} from './timetable.service';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
  }

@NgModule({
    declarations: [
        TimetableComponent,
        TimeTableModalComponent,
        TimetableDeleteConfirmComponent,
    ],
    imports: [
        CommonModule,
        TimetableRoutingModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory,
                deps: [HttpClient]},
            isolate: false
        })
    ],
    providers: [
        TableService,
    ],
    entryComponents: [
        TimetableDeleteConfirmComponent,
        TimeTableModalComponent
    ]
})

export class TimetableModule {}
