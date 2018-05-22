import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TableService} from '../timetable.service';
import {matchDates, startDateValidator} from './date-validation';

import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-timetable-modal',
  templateUrl: './timetable-modal.component.html',
  styleUrls: ['./timetable-modal.component.scss'],
  providers: [TableService]
})
export class TimeTableModalComponent implements OnInit {
  private form: FormGroup;
  formData = {
    group_id: '',
    subject_id: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    timetable_id: undefined
  };

  constructor(
    public dialogRef: MatDialogRef<TimeTableModalComponent>,
    public tableService: TableService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.tableItem instanceof Object) {
      // Create copy to prevent editing of table item object directly
      this.formData = Object.assign({}, this.data.tableItem);

      // this.formData.group_id = this.data.editData.group_id;
      // this.formData.subject_id = this.data.editData.subject_id;
      // this.formData.start_date = this.data.editData.start_date;
      // this.formData.start_time = this.data.editData.start_time;
      // this.formData.end_date = this.data.editData.end_date;
      // this.formData.end_time = this.data.editData.end_time;
      // this.formData.end_date = this.data.editData.end_date;
      // this.formData.timetable_id = this.formData.timetable_id;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        group: new FormControl(null, [Validators.required]),
        subject: new FormControl(null, [Validators.required]),
        startDate: new FormControl(null, [
          Validators.required,
          startDateValidator
        ]),
        startTime: new FormControl(null, [Validators.required]),
        endDate: new FormControl(null, [Validators.required]),
        endTime: new FormControl(null, [Validators.required])
      },
      {
        validators: [matchDates]
      }
    );
  }
  onReset = evt => {
    if (this.formData.timetable_id) {
      this.formData = Object.assign({}, this.data.tableItem);
    } else {this.formData = {
       group_id: '',
       subject_id: '',
       start_date: '',
       start_time: '',
       end_date: '',
       end_time: '',
       timetable_id: undefined
    };
    }
  }
  onSubmit = evt => {
    // if timetable_id exists then we need to edit item instead of adding new one
    if (this.formData.timetable_id) {
      // Prepare data for API call
      this.tableService
        .updateTableItem(this.formData.timetable_id, {
          group_id: this.formData.group_id,
          subject_id: this.formData.subject_id,
          start_date: this.formData.start_date,
          start_time: this.formData.start_time,
          end_date: this.formData.end_date,
          end_time: this.formData.end_time
        })
        .subscribe(response => {
          if (Array.isArray(response) && response.length >= 1) {
            for (const item of this.data.table) {
              if (item.timetable_id === response[0].timetable_id) {
                Object.assign(item, response[0], {
                  subject_name: this.data.subjectsMap.get(
                    response[0].subject_id
                  ),
                  group_name: this.data.groupsMap.get(response[0].group_id)
                });
              }
            }
            return this.dialogRef.close('Редагування успішно завершено');
          }
          return this.dialogRef.close('Виникла помилка при редагуванні. Повторіть спробу пізніше');
        }, () => this.dialogRef.close('Виникла помилка при редагуванні. Повторіть спробу пізніше'));
      return;
    }

    this.tableService
      .addTableItem({
        group_id: this.formData.group_id,
        subject_id: this.formData.subject_id,
        start_date: this.formData.start_date,
        start_time: this.formData.start_time,
        end_date: this.formData.end_date,
        end_time: this.formData.end_time
      })
      .subscribe(response => {
        if (!Array.isArray(response) || response.length <= 0) {
          return this.dialogRef.close('Виникла помилка при додаванні. Повторіть спробу пізніше');
        }

        this.data.table.push(
          Object.assign(
            {
              subject_name: this.data.subjectsMap.get(response[0].subject_id),
              group_name: this.data.groupsMap.get(response[0].group_id)
            },
            response[0]
          )

        );

        return this.dialogRef.close('Додавання успішно завершено');
      }, () => this.dialogRef.close('Виникла помилка при додаванні. Повторіть спробу пізніше'));
  }
}
