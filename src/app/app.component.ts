import { Component, OnInit } from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';
import {MatDialog} from '@angular/material';
import {SpinnerComponent} from './shared/spinner/spinner.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    constructor (private router: Router,
                 private dialog: MatDialog,
                 ) {}

    dialogRef: MatDialogRef<any>;

    spinnerStart() {
        this.dialogRef = this.dialog.open(SpinnerComponent, {
            panelClass: 'my-panel',
            width: '100'
        });
    }

    spinnerEnd() {
        this.dialogRef.close();
    }

    ngOnInit() {
      this.router.events
      .subscribe((event) => {
          if (event instanceof NavigationStart) {this.spinnerStart(); }
          if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError ) {
              this.spinnerEnd();
          }
      });
  }
}
