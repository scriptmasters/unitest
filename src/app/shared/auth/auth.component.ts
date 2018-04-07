import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from './auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [AuthService]

})

export class AuthComponent implements OnInit {
    returnUrl: string;
    loginForm: FormGroup;
    rgxpStudent = /^\/student.*/g;
    rgxpAdmin = /^\/admin.*/g;

    constructor(public authService: AuthService,
                private router: Router,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute) {
        this.createForm();
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
            .subscribe(params => {this.returnUrl = params['return']; } );

    }
}
