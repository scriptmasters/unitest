import {Component, OnInit} from '@angular/core';
import {AdministratorsService} from './services/administrators.service';
import {Administrators, IResponse} from './administratorsInterface';
import {MatDialog, MatPaginatorIntl} from '@angular/material';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {FormControl} from '@angular/forms';
import {AdministratorsDialogComponent} from './administrators-dialog/administrators-dialog.component';
import {Subscription} from 'rxjs/Subscription';
import {PaginationInstance} from 'ngx-pagination';
import 'rxjs/add/operator/debounceTime';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {IisLogged} from '../../shared/Interfaces/server_response';
import {Pagination} from '../../shared/pagination/pagination.class';
import {HttpClient} from '@angular/common/http';
import {PaginationService} from '../../shared/pagination/pagination.service';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent extends Pagination implements OnInit {

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
              public pagService: PaginationService) {
      super(router, route, pagIntl, http, dialog, pagService);
  }

  ngOnInit() {
    this.initLogic(true);
    this.administrators = this.route.snapshot.data['administrators'];
    this.searchSubscr = this.search.valueChanges
        .debounceTime(1000)
        .subscribe(newValue => {
            this.pagService.pagSubscr.next(false);
            this.administratorsService.getSearchedAdministrators(newValue)
                .subscribe(
                    (data: any) => {
                        if (data.response === 'no records') {
                            this.administrators = undefined;
                            this.error = 'За даним пошуковим запитом дані відсутні';
                        } else {
                            this.administrators = data;
                        }
                    },
                    () => {
                        this.administrators = undefined;
                        this.pagService.pagSubscr.next(false);
                    }
                );
        });
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
              this.dialog.open(ResponseMessageComponent, {
                width: '400px',
                data: {
                  message: response.message
                }
               });
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
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Ви не можете редагувати цього адміністратора!'
            }
          });
        }
    });
  }
// Delete modal
  deleteAdministrator(id): void {
    this.authService.isLogged().subscribe((result: IisLogged) => {
      if (+result.id === 1) {
        const dialogRef = this.dialog.open(DeleteConfirmComponent, {
          width: '500px',
          data: { message: 'Ви справді бажаєте видалити цього адміністратора'}
        });
        dialogRef.afterClosed().subscribe((Response: boolean) => {
          if (Response) {
            this.administratorsService.delAdministrator(id).subscribe((data: IResponse) => {
              if (data.response === 'ok') {
                this.dialog.open(ResponseMessageComponent, {
                  width: '400px',
                  data: {
                    message: 'Адміністратора було успішно видалено!'
                  }
                });
          this.getAllAdministrators();
              }
            },
              () => {
                this.dialog.open(ResponseMessageComponent, {
                  width: '400px',
                  data: {
                    message: 'Неможливо видалити цього адміністратора!'
                  }
                });
              });
          }
        });
        dialogRef.disableClose = true;
      } else {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Ви не можете видалити цього адміністратора!'
          }
        });
      }
    });
  }
}
