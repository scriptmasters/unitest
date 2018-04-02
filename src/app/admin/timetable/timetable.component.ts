import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import TableService, { Subject, Group, TimeEntity } from "./timetable.service";

interface TimeEntityTable extends TimeEntity {
  subject_name: string;
  group_name: string;
}

@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["./timetable.component.css"],
  providers: [TableService]
})
export class TimetableComponent implements OnInit {
  table: TimeEntityTable[];
  subjects: Map<string, string>;
  groups: Map<string, string>;

  constructor(public tableService: TableService) {
    this.subjects = new Map();
    this.groups = new Map();
    this.table = [];

    tableService.getTable().subscribe(
      async data => {
        await tableService
          .getGroups()
          .toPromise()
          .then(groups => {
            groups.forEach(group =>
              this.groups.set(group.group_id, group.group_name)
            );
          });

        await tableService
          .getSubjects()
          .toPromise()
          .then(subjects => {
            subjects.forEach(subject =>
              this.subjects.set(subject.subject_id, subject.subject_name)
            );
          });

        this.table = data.map((timeEntity: TimeEntity): TimeEntityTable => {
          return Object.assign({}, timeEntity, {
            group_name: this.groups.get(timeEntity.group_id),
            subject_name: this.subjects.get(timeEntity.subject_id)
          });
        });

        console.log(this.table);
      },
      err => {
        this.table = [];
      }
    );

    // this.getSubjects().forEach(subject =>
    //   this.subjects.set(subject.subject_id, subject.subject_name)
    // );

    // this.getGroups().forEach(group =>
    //   this.groups.set(group.group_id, group.group_name)
    // );

    // this.table = this.getTable().map(timeEntity => {
    //   timeEntity.group_name = this.groups.get(timeEntity.group_id);
    //   timeEntity.subject_name = this.subjects.get(timeEntity.subject_id);
    //   return timeEntity;
    // });
  }

  ngOnInit() {}
}
