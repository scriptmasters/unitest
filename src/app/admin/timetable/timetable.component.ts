import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import TableService, {Subject, Group, TimeEntity } from './timetable.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { TimeTableModal } from './timetable-modal/timetable-modal.component';
import { TimetableDeleteConfirmComponent } from './timetable-delete-confirm/timetable-delete-confirm.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';

interface TimeEntityTable extends TimeEntity {
  subject_name: string;
  group_name: string;
}

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
  providers: [TableService]
})
export class TimetableComponent implements OnInit {
  table: TimeEntityTable[] = [];
  subjects: Subject[] = [];
  groups: Group[] = [];

  groupId: string;
  subjectId: string;

  groupsMap: Map<string, string> = new Map();
  subjectsMap: Map<string, string> = new Map();

  constructor(
    public tableService: TableService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params.subjectId) {
        this.subjectId = params.subjectId;
      } else if (params.groupId) {
        this.groupId = params.groupId;
      }
    });

    const onSuccess = async data => {
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

      // If not records found
      if (!Array.isArray(data)) {
        return (this.table = [], this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'За даним запитом розкладу не знайдено '
            }}));
      }

      this.table = data.map((timeEntity: TimeEntity): TimeEntityTable => {
        return Object.assign({}, timeEntity, {
          group_name: this.groupsMap.get(timeEntity.group_id),
          subject_name: this.subjectsMap.get(timeEntity.subject_id)
        });
      });

      console.log(this.table);
    };

    const onError = () => (this.table = []);

    if (this.groupId) {
      tableService
        .getTableByGroupId(this.groupId)
        .subscribe(onSuccess, onError);
    } else if (this.subjectId) {
      tableService
        .getTableBySubjectId(this.subjectId)
        .subscribe(onSuccess, onError);
    } else {
      tableService.getTable().subscribe(onSuccess, onError);
    }
  }

  /**
   * Delete table item
   * id of table item to delete
   */
  onDelete(timeEntity: TimeEntityTable) {
    const dialogRef = this.dialog.open(TimetableDeleteConfirmComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((response: string) => {
      if (response) {
        if (response === 'ok') {
        this.tableService.deleteTableItem(timeEntity.timetable_id).subscribe(
          response => {
            this.table.splice(this.table.indexOf(timeEntity), 1);
            this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Профіль цього студента було успішно видалено!'
            }
          });
          },
          err => {
            console.error('err:', err);
            this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Виникла помилка при видаленні цього студента!'
            }
          });
          }
        );
      } else {
        alert('Відмінено');
      }
      }
    });
  }
  /**
   * Opens dialog to create table entity or edit it
   * table item we want to edit
   * if not presented we open modal to add new entity
   */
  openDialog(editData: TimeEntityTable): void {
    const dialogRef = this.dialog.open(TimeTableModal, {
      width: '800px',
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
      console.log('The dialog was closed, result:' + result);
    });
  }

  ngOnInit() {}
}
