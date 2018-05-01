import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from './administrators.service';
import { Administrators, IResponse } from './administratorsInterface';
import { MatDialog } from '@angular/material';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AdministratorsDialogComponent } from './administrators-dialog/administrators-dialog.component'

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent implements OnInit {
  
  administrators: Administrators[];

  constructor(private administratorsService: AdministratorsService, public dialog: MatDialog) { }

  ngOnInit() {
  	this.getAllAdministrators();

  }

  getAllAdministrators(): void {
    this.administratorsService.getAdministrators()
      .subscribe((data: Administrators[]) => {
        this.administrators = data;
       });
  }

  openDialog(id): void {
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
  } 

   deleteAdministrator(id): void {
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
        }},
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
  }


}
