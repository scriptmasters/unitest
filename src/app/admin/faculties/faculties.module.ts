import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {FacultiesResolver} from './services/faculties-resolver.service';
import {FacultiesDialogComponent} from './faculties-dialog/faculties-dialog.component';
import {FacultiesComponent} from './faculties.component';
import {FacultiesService} from './services/faculties.service';
import {FacultiesRoutingModule} from './faculties-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
  }

@NgModule({
  declarations: [
    FacultiesComponent,
    FacultiesDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FacultiesRoutingModule,
    TranslateModule.forChild({
      loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory,
          deps: [HttpClient]},
      isolate: false
  })
  ],
  providers: [
    FacultiesService,
    FacultiesResolver
  ],
  entryComponents: [
    FacultiesDialogComponent
  ]
})

export class FacultiesModule {}
