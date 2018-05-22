import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RequestInterceptor} from './request-interceptor';
import {
    MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatPaginatorIntl, MatPaginatorModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule
} from '@angular/material';
import {DeleteConfirmComponent} from './delete-confirm/delete-confirm.component';
import {ResponseMessageComponent} from './response-message/response-message.component';
import {CommonModule} from '@angular/common';
import {SpinnerComponent} from './spinner/spinner.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {RouterModule} from '@angular/router';
import {PaginationService} from './pagination/pagination.service';
import {PaginationPipe} from './pagination/pagination.pipe';

@NgModule({
    imports: [MatProgressSpinnerModule, CommonModule, RouterModule],
    declarations: [
        ResponseMessageComponent,
        DeleteConfirmComponent,
        SpinnerComponent,
        BreadcrumbComponent,
        PaginationPipe
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
        MatPaginatorModule,
        MatProgressSpinnerModule,
        BreadcrumbComponent,
        PaginationPipe,
        MatProgressBarModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true},
        MatPaginatorIntl,
        PaginationService
    ],
    entryComponents: [
        ResponseMessageComponent,
        SpinnerComponent,
        DeleteConfirmComponent,
        BreadcrumbComponent
    ]
})

export class SharedModule {
}
