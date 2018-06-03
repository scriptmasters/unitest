import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(public authService: AuthService, public translate: TranslateService) {
    translate.use('en');
  }

  ngOnInit() {

  }


  handleClick(elem: HTMLElement) {
    elem.classList.toggle('shown');
  }



}
