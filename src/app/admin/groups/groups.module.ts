import {FacultyFilterPipe} from './selectFilters/facultyFilter.pipe';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupsRoutingModule} from './groups-routing.module';
import {GroupsService} from './groups.service';
import {DialogComponent} from './dialog/dialog.component';
import {SharedModule} from '../../shared/shared.module';
import {GroupsComponent} from './groups.component';
import {SpecialityFilterPipe} from './selectFilters/specialityFilter.pipe';
import {GroupsDeleteConfirmComponent} from './groups-delete-confirm/groups-delete-confirm.component';
import {SearchFilterPipe} from './search.pipe';

@NgModule({
  declarations: [
    DialogComponent,
    GroupsDeleteConfirmComponent,
    GroupsComponent,
    SearchFilterPipe,
    FacultyFilterPipe,
    SpecialityFilterPipe
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedModule
  ],
  providers: [
    GroupsService
  ],
  entryComponents: [
    DialogComponent,
    GroupsDeleteConfirmComponent
  ]
})



export class GroupsModule {}
