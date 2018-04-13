import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import TableService, { Subject, Group, TableItem } from "./timetable.service";
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from "@angular/forms";
import { TimeTableModal } from "./timetable-modal/timetable-modal.component";
import { TimetableDeleteConfirmComponent } from "./timetable-delete-confirm/timetable-delete-confirm.component";
import { ResponseMessageComponent } from "../../shared/response-message/response-message.component";

interface TableItemModified extends TableItem {
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
  table: TableItemModified[] = [];
  subjects: Subject[] = [];
  groups: Group[] = [];

  groupsMap: Map<string, string> = new Map();
  subjectsMap: Map<string, string> = new Map();

  constructor(
    public tableService: TableService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    const onSuccess = async data => {
      await tableService
        .getGroups()
        .toPromise()
        .then((groups: Group[]) => {
          this.groups = groups;

          groups.forEach(group =>
            this.groupsMap.set(group.group_id, group.group_name)
          );
        });

      await tableService
        .getSubjects()
        .toPromise()
        .then((subjects: Subject[]) => {
          this.subjects = subjects;

          subjects.forEach(subject =>
            this.subjectsMap.set(subject.subject_id, subject.subject_name)
          );
        });

      // If no records found
      if (!Array.isArray(data)) {
        this.table = [];
        this.dialog.open(ResponseMessageComponent, {
          width: "400px",
          data: {
            message: "За даним запитом розкладу не знайдено"
          }
        });
        return;
      }

      this.table = data.map((timeEntity: TableItem): TableItemModified => {
        return Object.assign({}, timeEntity, {
          group_name: this.groupsMap.get(timeEntity.group_id),
          subject_name: this.subjectsMap.get(timeEntity.subject_id)
        });
      });
    };

    const onError = () => (this.table = []);

    this.route.queryParams.subscribe(params => {
      if (params.subjectId) {
        tableService
          .getTableBySubjectId(params.subjectId)
          .subscribe(onSuccess, onError);
      } else if (params.groupId) {
        tableService
          .getTableByGroupId(params.groupId)
          .subscribe(onSuccess, onError);
      } else {
        tableService.getTable().subscribe(onSuccess, onError);
      }
    });
  }

  /**
   * Delete table item
   * id of table item to delete
   */
  onDelete(timeEntity: TableItemModified) {
    let dialogRef = this.dialog.open(TimetableDeleteConfirmComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe((response: string) => {
      if (response) {
        if (response === "ok") {
          this.tableService.deleteTableItem(timeEntity.timetable_id).subscribe(
            response => {
              this.table.splice(this.table.indexOf(timeEntity), 1);
              this.dialog.open(ResponseMessageComponent, {
                width: "400px",
                data: {
                  message: "Розклад успішно видалено!"
                }
              });
            },
            err => {
              console.error("err:", err);
              this.dialog.open(ResponseMessageComponent, {
                width: "400px",
                data: {
                  message: "Виникла помилка при видаленні розкладу!"
                }
              });
            }
          );
        }
      }
    });
  }

  /**
   * Opens dialog to create table entity or edit it
   * table item we want to edit
   * if not presented we open modal to add new entity
   */
  openDialog(tableItem: TableItemModified): void {
    let dialogRef = this.dialog.open(TimeTableModal, {
      width: "800px",
      data: {
        table: this.table,
        subjects: this.subjects,
        groups: this.groups,
        groupsMap: this.groupsMap,
        subjectsMap: this.subjectsMap,
        tableItem
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
         this.dialog.open(ResponseMessageComponent, {
        width: "400px",
        data: {
          message: result
        }
      });
      }
    });
  }
  
  ngOnInit() {}
}
