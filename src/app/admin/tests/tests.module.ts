import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { TestsComponent } from './tests.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { TestsValidatorDirective } from './tests-validator.directive';
import { TestService } from './test.service';
import { TestsRoutingModule } from './tests-routing.module';


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
        TestsRoutingModule
    ],
    providers: [TestService]
})

export class TestsModule { }
