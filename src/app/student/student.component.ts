import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { TestPlayerService } from './services/test-player.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private testPlayerService: TestPlayerService,
    private router: Router
  ) {}

  startTest(): void {
    this.testPlayerService.startTest().subscribe(
      () => {
        this.router.navigate(['test']);
      },
      error => console.log(error)
    );
  }

  ngOnInit() {}
}
