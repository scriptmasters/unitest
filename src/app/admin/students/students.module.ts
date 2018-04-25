import { NgModule } from '@angular/core';
import { StudentsComponent } from './students.component';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsService } from './students.service';
import { SearchStudentPipe } from './/filters/searchStudent.pipe';
import { SharedModule } from '../../shared/shared.module';
import { StudentsResolver } from './students-resolver.service';
import { CommonModule } from '@angular/common';
import { StudentsModalWindowComponent } from './students-modal-window/students-modal-window.component';
import { FilterByGroupPipe } from './filters/filter-by-group.pipe';

@NgModule({
    declarations: [
        StudentsComponent,
        SearchStudentPipe,
        FilterByGroupPipe,
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
        StudentsModalWindowComponent
    ]
})

export class StudentsModule {}
