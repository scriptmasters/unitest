import { Component, OnInit } from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {ResponseMessageComponent} from './shared/response-message/response-message.component';
import {MatDialogRef} from '@angular/material/dialog';
import {MatDialog} from '@angular/material';


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
        this.dialog.open(ResponseMessageComponent, {
            panelClass: 'my-panel',
            width: '100',
            data: {
                message: 'spinner'
            }
        });
    }
        spinnerEnd() {
            this.dialogRef = this.dialog.openDialogs[this.dialog.openDialogs.length - 1];
            this.dialogRef.close();
        }

    ngOnInit() {
      this.router.events
      .subscribe((event) => {
          // example: NavigationStart, RoutesRecognized, NavigationEnd
          if (event instanceof NavigationStart) {this.spinnerStart(); }
          if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError ) {
              this.spinnerEnd();
          }
      });
  }
}
