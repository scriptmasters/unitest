import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AdministratorsResolver } from './services/administrators-resolver.service';
import { AdministratorsDialogComponent } from './administrators-dialog/administrators-dialog.component';
import { AdministratorsComponent } from './administrators.component';
import { AdministratorsService } from './services/administrators.service';
import { AdministratorsRoutingModule } from './administrators-routing.module';

@NgModule({
  declarations: [
    AdministratorsComponent,
    AdministratorsDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdministratorsRoutingModule
  ],
  providers: [
    AdministratorsService,
    AdministratorsResolver
  ],
  entryComponents: [
    AdministratorsDialogComponent
  ]
})

export class AdministratorsModule {}
