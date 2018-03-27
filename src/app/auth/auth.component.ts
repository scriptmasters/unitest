import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [AuthService]

})


export class AuthComponent implements OnInit {
    auth1: any = {};





  constructor(public authService: AuthService) {}


  submit() {
  this.authService.showAuth(this.auth1.username, this.auth1.password, this.auth1.confirm_password);

}

  ngOnInit() {
      this.authService.authStatusGet();
  }

  }
