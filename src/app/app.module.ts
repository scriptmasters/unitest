import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { StudentGuard } from './student-guard.service';
import { AdminGuard } from './admin-guard.service';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import {RequestInterceptor} from './shared/request-interceptor';
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule
    ],

    entryComponents: [ AppComponent ],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ],
    providers: [
        StudentGuard,
        AdminGuard,
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
    ]
})

export class AppModule {}
