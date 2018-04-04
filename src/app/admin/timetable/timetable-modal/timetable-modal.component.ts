import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from "@angular/forms";

@Component({
  selector: "timetable-modal",
  templateUrl: "timetable-modal.component.html",
  styleUrls: ["./timetable-modal.component.css"]
})
export class TimeTableModal implements OnInit {
  private form: FormGroup;
  subject = "";
  group = "";
  startDate = "";
  endDate = "";
  startTime = "";
  endTime = "";

  constructor(
    public dialogRef: MatDialogRef<TimeTableModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

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
    this.data.table.push(
      Object.assign(
        {},
        {
          timetable_id: "24",
          group_id: this.group,
          subject_id: this.subject,
          start_date: this.startDate,
          start_time: this.startTime,
          end_date: this.endDate,
          end_time: this.endTime,
          group_name: this.data.groupsMap.get(this.group),
          subject_name: this.data.subjectsMap.get(this.subject)
        }
      )
    );
    return this.dialogRef.close();
  };
}
