import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdministratorsService} from './services/administrators.service';
import {Administrators, IResponse} from './administratorsInterface';
import {MatDialog, MatPaginatorIntl, MatSnackBar} from '@angular/material';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {FormControl} from '@angular/forms';
import {AdministratorsDialogComponent} from './administrators-dialog/administrators-dialog.component';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {IisLogged} from '../../shared/Interfaces/server_response';
import {Pagination} from '../../shared/pagination/pagination.class';
import {HttpClient} from '@angular/common/http';
import {PaginationService} from '../../shared/pagination/pagination.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent extends Pagination implements OnInit, OnDestroy {

    administrators: Administrators[];
    error: string;
    search = new FormControl();
    searchSubscr: Subscription;

  constructor(private administratorsService: AdministratorsService,

   public authService: AuthService,
              public router: Router,
              public route: ActivatedRoute,
              public pagIntl: MatPaginatorIntl,
              public http: HttpClient,
              public dialog: MatDialog,
              public pagService: PaginationService,
              public snackBar: MatSnackBar, private translate: TranslateService) {
      super(router, route, pagIntl, http, dialog, pagService, snackBar);
  }

  ngOnInit() {
    this.initLogic(true);
    this.administrators = this.route.snapshot.data['administrators'];
    this.searchSubscr = this.search.valueChanges
        .debounceTime(600)
        .subscribe(newValue => {
            this.administratorsService.getSearchedAdministrators(newValue)
                .subscribe(
                    (data: any) => {
                        this.pagService.pagSubscr.next(false);
                        if (data.response === 'no records') {
                            this.administrators = undefined;
                            this.error = 'За даним пошуковим запитом дані відсутні';
                        } else {
                            this.administrators = data;
                            this.pageIndex = 0;
                        }
                    },
                    () => {
                        this.administrators = undefined;
                        this.pagService.pagSubscr.next(false);
                    }
                );
        });
  }

  ngOnDestroy() {
      this.destroyLogic();
  }

  getAllAdministrators(): void {
    this.administratorsService.getAdministrators()
      .subscribe((data: Administrators[]) => {
        this.administrators = data;
       });
  }

// Add and update modal
  openDialog(id?): void {
    const adminId = id;
    this.authService.isLogged().subscribe((result: IisLogged) => {
      if (result.id === adminId || +result.id === 1 || adminId === undefined) {
        const matDialogRef = this.dialog.open(AdministratorsDialogComponent, {
          width: '500px',
          data: {id: id}
        });
        matDialogRef.afterClosed().subscribe((response: any) => {
          if (response) {
            if (response.status === 'SUCCESS') {
              this.openTooltip(response.message);
              this.getAllAdministrators();
            } else if (response.status === 'ERROR') {
              this.dialog.open(ResponseMessageComponent, {
                width: '400px',
                data: {
                  message: response.message
                }
              });
            }
          }
        });
        matDialogRef.disableClose = true;
      } else {
          this.translate.get('ADMIN.ADMIN.CANT').subscribe(msg => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: msg
              }
            });
          });
        }
    });
  }
// Delete modal
  deleteAdministrator(id): void {
    this.translate.get('ADMIN.ADMIN.DELQ').subscribe(msg => {
      this.authService.isLogged().subscribe((result: IisLogged) => {
        if (+result.id === 1) {
          const dialogRef = this.dialog.open(DeleteConfirmComponent, {
            width: '500px',
            data: { message: msg}
          });
          dialogRef.afterClosed().subscribe((Response: boolean) => {
            if (Response) {
              this.administratorsService.delAdministrator(id).subscribe((data: IResponse) => {
                if (data.response === 'ok') {
                  this.translate.get('ADMIN.ADMIN.DEL').subscribe(m => {
                    this.openTooltip(m);
                  });
            this.getAllAdministrators();
                }
              },
                () => {
                  this.translate.get('ADMIN.ADMIN.NOTDEL').subscribe(me => {
                    this.dialog.open(ResponseMessageComponent, {
                      width: '400px',
                      data: {
                        message: me
                      }
                    });
                  });
                });
            }
          });
          dialogRef.disableClose = true;
        } else {
          this.translate.get('ADMIN.ADMIN.CDEL').subscribe(mgs => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: mgs
              }
            });
          });
        }
      });
    });
  }
}
