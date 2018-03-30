import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DataService]
})
export class LoginComponent implements OnInit {

  login: string = '';
  password: string = '';

  Data: any = {
    response: 'someresponse'
  }

  constructor(private DataService: DataService, private router: Router) { }

  ngOnInit() {
    this.DataService.toKnowIsLogged().subscribe(data => this.Data = data);
    if (this.Data.response === 'logged') {
      this.router.navigate(['/admin']);
    }

  }

  handleSubmit() {
    const body: object = {
      username: this.login,
      password: this.password
    }
    const jsonbody: string = JSON.stringify(body);
    this.DataService.getLogged(jsonbody).subscribe(() => {
        this.DataService.toKnowIsLogged().subscribe(data => this.Data = data);
        if (this.Data.response === 'logged') {
        this.router.navigate(['/admin']);
      }
    });
  }

}
