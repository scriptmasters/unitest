import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/auth/auth.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],

})
export class StudentComponent implements OnInit {

    constructor() {}

  ngOnInit() {
      /*this.authService.authStatusGet ();*/
  }

}
