import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [AuthService]

})


export class AuthComponent implements OnInit {
  auth1: any = {};

  constructor(public authService: AuthService) {}

  submit() {
    this.authService.login(this.auth1.username, this.auth1.password);
  }

  ngOnInit() {}

  }
