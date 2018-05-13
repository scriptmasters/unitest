import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {ModalSubjectComponent} from './modal-subject/modal-subject.component';
import {SubjectsComponent} from './subjects.component';
import {SubjectService} from './services/subject.service';
import {SubjectsRoutingModule} from './subjects-routing.module';

@NgModule({
    declarations: [SubjectsComponent, ModalSubjectComponent],
    imports: [CommonModule, SharedModule, SubjectsRoutingModule],
    providers: [SubjectService],
    entryComponents: [ModalSubjectComponent],
})
export class SubjectsModule {
}
