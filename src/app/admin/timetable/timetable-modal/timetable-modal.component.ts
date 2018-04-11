import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import TableService, { Subject, Group, TimeEntity } from "../timetable.service";

import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from "@angular/forms";

@Component({
  selector: "timetable-modal",
  templateUrl: "./timetable-modal.component.html",
  styleUrls: ["./timetable-modal.component.css"],
  providers: [TableService]
})
export class TimeTableModal implements OnInit {
  private form: FormGroup;
  formData: TimeEntity = {
    group_id: "",
    subject_id: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: ""
  };

  constructor(
    public dialogRef: MatDialogRef<TimeTableModal>,
    public tableService: TableService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.editData instanceof Object) {
      // Create copy to prevent editing of table item object directly
      this.formData = Object.assign({}, this.data.editData);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      group: new FormControl(null, [Validators.required]),
      subject: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required])
    });
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
            for (let item of this.data.table) {
              if (item.timetable_id === response[0].timetable_id) {
                Object.assign(item, response[0], {
                  subject_name: this.data.subjectsMap.get(
                    response[0].subject_id
                  ),
                  group_name: this.data.groupsMap.get(response[0].group_id)
                });
              }
            }
            return this.dialogRef.close();
          }

          return alert("Сервер вернув помилку. Спробуйте пізніше...");
        });
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
          return console.error("ERROR");
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

        return this.dialogRef.close();
      });
  };
}
