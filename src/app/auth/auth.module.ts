import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthErrorPopupComponent } from './auth-error-popup/auth-error-popup.component';
import { AuthService } from './auth.service';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [CommonModule, SharedModule, AuthRoutingModule],
    entryComponents: [AuthErrorPopupComponent],
    declarations: [AuthComponent, AuthErrorPopupComponent],
    providers: [AuthService]
})
export class AuthModule { }
