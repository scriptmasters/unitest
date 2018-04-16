import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Idata} from '../../Interfaces/server_response';

@Component({
    selector: 'app-auth-error-popup.component',
    templateUrl: 'auth-error-popup.component.html',
    styleUrls: ['./auth-error-popup.component.scss']
})
export class AuthErrorPopupComponent {

    constructor( @Inject(MAT_DIALOG_DATA) public data: Idata ) { }

}
