import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { RequestInterceptor } from './request-interceptor';
import {
    MatPaginatorIntl,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
} from '@angular/material';

import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from './response-message/response-message.component';
import {CommonModule} from '@angular/common';


@NgModule({
    imports: [MatProgressSpinnerModule, CommonModule],
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
        NgxPaginationModule,
        MatPaginatorModule,
        MatProgressSpinnerModule
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }, MatPaginatorIntl],
    entryComponents: [
        ResponseMessageComponent,
        DeleteConfirmComponent
    ]
})

export class SharedModule {}

