import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from './administrators.service';
import { Administrators, IResponse } from './administratorsInterface';
import { MatDialog } from '@angular/material';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';

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
