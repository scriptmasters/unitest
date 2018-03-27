import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DataService]
})
export class LoginComponent implements OnInit {

  login: string = '';
  password: string = '';

  constructor(private DataService: DataService) { }

  ngOnInit() {
  }

  handleSubmit() {
    const body: object = {
      username: this.login,
      password: this.password
    }
    const jsonbody: string = JSON.stringify(body);
    this.DataService.getLogged(jsonbody).subscribe(data => { 
      this.DataService.isLogged = data;
    });
  }

  isLogged() {
    return this.DataService.isLogged;
  }

  handleLogged() {
    this.DataService.toKnowIsLogged().subscribe(data => console.log(data));
  }

  logOut() {
    this.DataService.logOut().subscribe(data => {
      this.DataService.isLogged = null;
      console.log(data);
    });
  }

}
