import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from './auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {AuthErrorPopupComponent} from './auth-error-popup/auth-error-popup.component';
import {MatSnackBar} from '@angular/material';
import {Ilogin, IisLogged} from '../shared/Interfaces/server_response';
import {SymbolValidator} from './custom-validator';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [AuthService]

})

export class AuthComponent implements OnInit {
    returnUrl: string;
    user: string;
    loginForm: FormGroup;
    rgxpStudent = /^\/student.*/g;
    rgxpAdmin = /^\/admin.*/g;
    requestError: string;

    constructor(public authService: AuthService,
                private router: Router,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                public dialog: MatDialog,
                public snackBar: MatSnackBar) {
        this.createForm();
    }

    createForm(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.compose([Validators.required, SymbolValidator(' ')])],
            password: ['', Validators.compose([Validators.required, SymbolValidator(' ')])],
        });
    }

    submit(): void {
        if (!this.loginForm.invalid) {
            this.authService.login(this.loginForm.value)
                .subscribe((data: Ilogin) => {

                    switch (data.roles[1]) {
                        case 'admin' :
                            (this.rgxpAdmin.test(this.returnUrl)) ?
                                this.router.navigate([this.returnUrl]) :
                                this.router.navigate(['/admin/statistic']);
                            break;

                        case 'student' :
                            (this.rgxpStudent.test(this.returnUrl)) ?
                                this.router.navigate([this.returnUrl]) : this.router.navigate(['/student']);
                            break;
                    }
                }, error => error.error.response === 'Invalid login or password' ?
                    this.requestError = 'Невірний логін або пароль' : this.requestError = 'Перевірте з\'єднання інтернет'
            );
        }
    }

    openDialog() {
        const dialogRef = this.dialog.open(AuthErrorPopupComponent, {
            width: '500px',
            data: {user: this.user, returnUrl: this.returnUrl}
        });

        dialogRef.afterClosed().subscribe((result: string) => {

            if (result === 'student') {
                this.router.navigate(['/student']);
            } else {
                if (result === 'admin') {
                    this.router.navigate(['/admin/statistic']);
                }
            }
        });
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.returnUrl = params['return'];
                if (params['return']) {
                    this.authService.isLogged().subscribe((result: IisLogged) => {
                        if (result.response === 'non logged') {
                                    this.snackBar.open('You are not logged in', 'OK', {
                                    duration: 2000
                                });
                        } else {
                            (this.rgxpAdmin.test(params['return'])) ? this.user = 'admin' : this.user = 'student';
                            this.openDialog();
                        }
                    });
                }
            });
    }
}
