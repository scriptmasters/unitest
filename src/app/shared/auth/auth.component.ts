import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from './auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {AuthErrorPopupComponent} from './auth-error-popup/auth-error-popup.component';
import {MatSnackBar} from '@angular/material';


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

    constructor(public authService: AuthService,
                private router: Router,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                public dialog: MatDialog,
                public snackBar: MatSnackBar) {
        this.createForm();
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AuthErrorPopupComponent, {
            width: '500px',
            data: {user: this.user, returnUrl: this.returnUrl}
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result === 'student') {
                this.router.navigate(['/student']);
            } else {
                if (result === 'admin') {
                    this.router.navigate(['/admin']);
                }
            }
            });
    }

    createForm() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
        });
    }

    submit() {
        if (!this.loginForm.invalid) {
            this.authService.login(this.loginForm.value)
                .subscribe((data: any) => {
                    switch (data.roles[1]) {
                        case 'admin' :
                            if (this.rgxpAdmin.test(this.returnUrl)) {
                                this.router.navigate([this.returnUrl]);
                            } else {
                                this.router.navigate(['/admin']);
                            }
                            break;

                        case 'student' :
                            if (this.rgxpStudent.test(this.returnUrl)) {
                                this.router.navigate([this.returnUrl]);
                            } else {
                                this.router.navigate(['/student']);
                            }
                            break;
                    }
                }, error => document.getElementById('error').innerHTML = error.error.response
            );
        }
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.returnUrl = params['return'];
                this.authService.isLogged().subscribe((result: any) => {
                    if (result.response === 'non logged') {
                        if (params['return']) {this.snackBar.open('You are not logged in', 'OK', {
                            duration: 2000,
                        });
                        }
                    } else {
                        if (this.rgxpAdmin.test(params['return'])) {
                            this.user = 'admin';
                            this.openDialog();
                        } else {
                            this.user = 'student';
                            this.openDialog();
                        }
                    }
                });
            });
    }
}
