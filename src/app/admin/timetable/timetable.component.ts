import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import TableService, { Subject, Group, TimeEntity } from "./timetable.service";
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from "@angular/forms";
import { TimeTableModal } from "./timetable-modal/timetable-modal.component";

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
  subjects: Subject[];
  groups: Group[];

  groupsMap: Map<string, string> = new Map();
  subjectsMap: Map<string, string> = new Map();

  constructor(public tableService: TableService, public dialog: MatDialog) {
    this.table = [];
    this.subjects = [];
    this.groups = [];

    tableService.getTable().subscribe(
      async data => {
        await tableService
          .getGroups()
          .toPromise()
          .then(groups => {
            this.groups = groups;

            groups.forEach(group =>
              this.groupsMap.set(group.group_id, group.group_name)
            );
          });

        await tableService
          .getSubjects()
          .toPromise()
          .then(subjects => {
            this.subjects = subjects;
            subjects.forEach(subject =>
              this.subjectsMap.set(subject.subject_id, subject.subject_name)
            );
          });

        this.table = data.map((timeEntity: TimeEntity): TimeEntityTable => {
          return Object.assign({}, timeEntity, {
            group_name: this.groupsMap.get(timeEntity.group_id),
            subject_name: this.subjectsMap.get(timeEntity.subject_id)
          });
        });

        console.log(this.table);
      },
      err => {
        this.table = [];
      }
    );

    // this.getSubjects().forEach(subject =>
    //   this.subjectsMap.set(subject.subject_id, subject.subject_name)
    // );

    // this.getGroups().forEach(group =>
    //   this.groupsMap.set(group.group_id, group.group_name)
    // );

    // this.table = this.getTable().map(timeEntity => {
    //   timeEntity.group_name = this.groupsMap.get(timeEntity.group_id);
    //   timeEntity.subject_name = this.subjectsMap.get(timeEntity.subject_id);
    //   return timeEntity;
    // });
  }

  onDelete(id) {
    return this.table.splice(this.table.indexOf(id), 1);
  }

  openDialog(): void {
    console.log("called");
    let dialogRef = this.dialog.open(TimeTableModal, {
      width: "800px",
      data: {
        table: this.table,
        subjects: this.subjects,
        groups: this.groups,
        groupsMap: this.groupsMap,
        subjectsMap: this.subjectsMap
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed, result:" + result);
    });
  }
  ngOnInit() {}
}
