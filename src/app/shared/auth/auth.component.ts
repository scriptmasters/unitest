import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [AuthService]

})


export class AuthComponent implements OnInit {
  auth1: any = {};
  returnUrl: string;

  constructor(public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {}

  submit() {
    this.authService.login(this.auth1.username, this.auth1.password, this.returnUrl);
  }

  ngOnInit() {
      this.route.queryParams
          .subscribe(params => {this.returnUrl = params['return']; } );
  }

  }
