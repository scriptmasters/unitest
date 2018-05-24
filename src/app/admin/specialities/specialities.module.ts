import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpecialitiesComponent} from './specialities.component';
import {SpecialityService} from './speciality.service';
import {PopupFormComponent} from './popup-form/popup-form.component';
import {SharedModule} from '../../shared/shared.module';
import {SpecialitiesRoutingModule} from './specialities-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SpecialitiesRoutingModule,
    ],
    declarations: [SpecialitiesComponent, PopupFormComponent],
    entryComponents: [PopupFormComponent],
    providers: [SpecialityService]
})
export class SpecialitiesModule {
}
