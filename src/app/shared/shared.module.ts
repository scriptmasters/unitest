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
import { PaginationComponent } from './pagination/pagination.component';
import {CommonModule} from '@angular/common';
import {SpinnerComponent} from './spinner/spinner.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [MatProgressSpinnerModule, CommonModule, RouterModule],
    declarations: [
        ResponseMessageComponent,
        DeleteConfirmComponent,
        PaginationComponent,
        SpinnerComponent,
        BreadcrumbComponent
    ],
    exports: [
        CommonModule,
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
        MatProgressSpinnerModule,
        PaginationComponent,
        BreadcrumbComponent
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }, MatPaginatorIntl],
    entryComponents: [
        ResponseMessageComponent,
        SpinnerComponent,
        DeleteConfirmComponent,
        BreadcrumbComponent
    ]
})

export class SharedModule {}

