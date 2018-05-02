import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';

import { FacultiesDialogComponent } from './faculties-dialog/faculties-dialog.component';
import { FacultiesComponent } from './faculties.component';
import { FacultiesService } from './faculties.service';
import { FacultiesRoutingModule } from './faculties-routing.module';

@NgModule({
  declarations: [
    FacultiesComponent,
    FacultiesDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FacultiesRoutingModule
  ],
  providers: [
    FacultiesService
  ],
  entryComponents: [
    FacultiesDialogComponent
  ]
})

export class FacultiesModule {}
