import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from './auth.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [AuthService]

})


export class AuthComponent implements OnInit {
  returnUrl: string;

    username = new FormControl('', [Validators.required]);
    password = new FormControl('', [Validators.required, Validators.minLength(8)]);



  constructor(public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {}

  submit() {

    this.authService.login(this.username.value, this.password.value, this.returnUrl);
  }

  ngOnInit() {

      this.route.queryParams
          .subscribe(params => {this.returnUrl = params['return']; } );

  }

  }
