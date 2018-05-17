import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router ) { }

  ngOnInit() {

  }


  handleClick(elem: HTMLElement) {
    elem.classList.toggle('shown');
    console.dir(elem);
  }



}
