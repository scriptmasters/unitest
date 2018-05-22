import {NgModule} from '@angular/core';
import {TimetableComponent} from './timetable.component';
import {TimeTableModalComponent} from './timetable-modal/timetable-modal.component';
import {TimetableDeleteConfirmComponent} from './timetable-delete-confirm/timetable-delete-confirm.component';
import {TimetableRoutingModule} from './timetable-routing.module';
import {TableService} from './timetable.service';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        TimetableComponent,
        TimeTableModalComponent,
        TimetableDeleteConfirmComponent,
    ],
    imports: [
        CommonModule,
        TimetableRoutingModule,
        SharedModule
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
