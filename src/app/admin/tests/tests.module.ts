import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {TestsComponent} from './tests.component';
import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';
import {TestsValidatorDirective} from './tests-validator.directive';
import {TestService} from './test.service';
import {TestsRoutingModule} from './tests-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
  }

@NgModule({
    declarations: [
        TestsComponent,
        EditComponent,
        AddComponent,
        TestsValidatorDirective
    ],

    entryComponents: [
        EditComponent,
        AddComponent
    ],

    imports: [
        CommonModule,
        SharedModule,
        TestsRoutingModule,
        TranslateModule.forChild({
            loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory,
                deps: [HttpClient]},
            isolate: false
        })
    ],
    providers: [TestService]
})

export class TestsModule { }
