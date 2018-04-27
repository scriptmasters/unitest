import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GroupsRoutingModule} from './groups-routing.module';
import {GroupsService} from './groups.service';
import {DialogComponent} from './dialog/dialog.component';
import {SharedModule} from '../../shared/shared.module';
import {GroupsDeleteConfirmComponent} from './groups-delete-confirm/groups-delete-confirm.component';
import {GroupsComponent} from './groups.component';

@NgModule({
  declarations: [
    DialogComponent,

    GroupsDeleteConfirmComponent,
    GroupsComponent
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
