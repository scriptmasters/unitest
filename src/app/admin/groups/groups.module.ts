import {FacultyFilterComponent} from './selectFilters/facultyFilter.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupsRoutingModule} from './groups-routing.module';
import {GroupsService} from './groups.service';
import {DialogComponent} from './dialog/dialog.component';
import {SharedModule} from '../../shared/shared.module';
import {GroupsComponent} from './groups.component';
import {SearchFilter} from './search.component';
import {SpecialityFilterComponent} from './selectFilters/specialityFilter.component';
import {GroupsDeleteConfirmComponent} from './groups-delete-confirm/groups-delete-confirm.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
  }

@NgModule({
  declarations: [
    DialogComponent,
    GroupsDeleteConfirmComponent,
    GroupsComponent,
    SearchFilter,
    FacultyFilterComponent,
    SpecialityFilterComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory,
          deps: [HttpClient]},
      isolate: false
  })
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
