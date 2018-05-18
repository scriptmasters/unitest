import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(public authService: AuthService ) { }

  ngOnInit() {

  }


  handleClick(elem: HTMLElement) {
    elem.classList.toggle('shown');
    console.dir(elem);
  }



}
