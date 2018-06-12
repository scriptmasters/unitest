import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {AdministratorsResolver} from './services/administrators-resolver.service';
import {AdministratorsDialogComponent} from './administrators-dialog/administrators-dialog.component';
import {AdministratorsComponent} from './administrators.component';
import {AdministratorsService} from './services/administrators.service';
import {AdministratorsRoutingModule} from './administrators-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
  }

@NgModule({
  declarations: [
    AdministratorsComponent,
    AdministratorsDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdministratorsRoutingModule,
    TranslateModule.forChild({
      loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory,
          deps: [HttpClient]},
      isolate: false
  })
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
