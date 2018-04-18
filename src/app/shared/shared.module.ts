import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { RequestInterceptor } from './request-interceptor';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from './response-message/response-message.component';


@NgModule({
    declarations: [
        ResponseMessageComponent,
        DeleteConfirmComponent
    ],
    exports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatDialogModule,
        MatInputModule,
        MatSnackBarModule,
        MatButtonModule,
        MatSelectModule,
        DeleteConfirmComponent,
        ResponseMessageComponent,
        NgxPaginationModule
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }],
    entryComponents: [
        ResponseMessageComponent,
        DeleteConfirmComponent
    ]
})

export class SharedModule {}

