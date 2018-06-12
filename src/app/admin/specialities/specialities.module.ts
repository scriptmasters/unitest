import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpecialitiesComponent} from './specialities.component';
import {SpecialityService} from './speciality.service';
import {PopupFormComponent} from './popup-form/popup-form.component';
import {SharedModule} from '../../shared/shared.module';
import {SpecialitiesRoutingModule} from './specialities-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
  }

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SpecialitiesRoutingModule,
        TranslateModule.forChild({
            loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory,
                deps: [HttpClient]},
            isolate: false
        })
    ],
    declarations: [SpecialitiesComponent, PopupFormComponent],
    entryComponents: [PopupFormComponent],
    providers: [SpecialityService]
})
export class SpecialitiesModule {
}
