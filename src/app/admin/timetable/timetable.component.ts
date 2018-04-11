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
  table: TimeEntityTable[] = [];
  subjects: Subject[] = [];
  groups: Group[] = [];

  groupsMap: Map<string, string> = new Map();
  subjectsMap: Map<string, string> = new Map();

  constructor(public tableService: TableService, public dialog: MatDialog) {
  /** 
   *  login is FOR TEST ONLY
   * TODO: REMOVE before prod 
   */
    
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
    
  }

  /**
   * Delete table item
   * id of table item to delete
   */
  onDelete(timeEntity: TimeEntityTable) {
    this.tableService.deleteTableItem(timeEntity.timetable_id).subscribe(
      response => {
        return this.table.splice(this.table.indexOf(timeEntity), 1);
      },
      err => {
        console.error("err:", err);
        alert("Сервер вернув помилку. Спробуйте пізніше...");
      }
    );
  }

  /**
   * Opens dialog to create table entity or edit it
   * table item we want to edit
   * if not presented we open modal to add new entity
   */
  openDialog(editData: TimeEntityTable): void {
    let dialogRef = this.dialog.open(TimeTableModal, {
      width: "800px",
      data: {
        table: this.table,
        subjects: this.subjects,
        groups: this.groups,
        groupsMap: this.groupsMap,
        subjectsMap: this.subjectsMap,
        editData
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed, result:" + result);
    });
  }

  ngOnInit() {}
}
