import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {StudentGuard} from './student-guard.service';
import {AdminGuard} from './admin-guard.service';
import {SharedModule} from './shared/shared.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        TranslateModule.forRoot()
    ],
    entryComponents: [AppComponent],
    declarations: [AppComponent, PageNotFoundComponent],
    bootstrap: [AppComponent],
    providers: [
        StudentGuard,
        AdminGuard
    ]
})

export class AppModule {
}

