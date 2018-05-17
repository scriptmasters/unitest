import { FacultyFilterComponent } from './selectFilters/facultyFilter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GroupsRoutingModule} from './groups-routing.module';
import {GroupsService} from './groups.service';
import {DialogComponent} from './dialog/dialog.component';
import {SharedModule} from '../../shared/shared.module';
import {GroupsComponent} from './groups.component';
import { SearchFilter } from './search.component';
import { SpecialityFilterComponent } from './selectFilters/specialityFilter.component';

@NgModule({
  declarations: [
    DialogComponent,
    GroupsComponent,
    SearchFilter,
    FacultyFilterComponent,
    SpecialityFilterComponent
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
    DialogComponent
  ]
})



export class GroupsModule {}
