import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from './services/administrators.service';
import { Administrators, IResponse } from './administratorsInterface';
import { MatDialog } from '@angular/material';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { FormControl } from '@angular/forms';
import { AdministratorsDialogComponent } from './administrators-dialog/administrators-dialog.component';
import {Subscription} from 'rxjs/Subscription';
import {PaginationInstance} from 'ngx-pagination';
import 'rxjs/add/operator/debounceTime';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { IisLogged } from '../../shared/Interfaces/server_response';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent implements OnInit {

    administrators: Administrators[];
    error: string;
    searchBox = new FormControl();
    searchBoxSubscr: Subscription;

    public config: PaginationInstance = {
     itemsPerPage: 10,
     currentPage: 1
  };


  constructor(private administratorsService: AdministratorsService,
   public dialog: MatDialog,
   private route: ActivatedRoute,
   public authService: AuthService) { }

  ngOnInit() {
    this.administrators = this.route.snapshot.data['administrators'];
    this.searchBoxSubscr = this.searchBox.valueChanges
        .debounceTime(1000)
        .subscribe(newValue => {
            this.administratorsService.getSearchedAdministrators(newValue)
                .subscribe(
                    (data: any) => {
                        if (data.response === 'no records') {
                            this.administrators = undefined;
                            this.error = 'За даним пошуковим запитом дані відсутні';
                        } else {
                            this.administrators = data;
                        }
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
  openDialog(id): void {
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
