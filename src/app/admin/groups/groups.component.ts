///<reference path="../../../../node_modules/rxjs/add/operator/mergeMap.d.ts"/>
import {ActivatedRoute} from '@angular/router';
import {DialogComponent} from './dialog/dialog.component';
import {GroupsService} from './groups.service';
import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Table, Groups, Faculties, Specialities, AddGroup} from './interface';
import {Router} from '@angular/router';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {PaginationInstance} from 'ngx-pagination';
import 'rxjs/add/operator/mergeMap';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';



@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  providers: [GroupsService]
})

export class GroupsComponent implements OnInit {
  groups: Groups[] = [];
  faculties: Faculties[] = [];
  specialities: Specialities[] = [];
  table: Table[] = [];

  specialityId: string;
  facultyId: string;

  searchFilter = '';
  facultyFilter = 'Виберіть факультет';
  specialityFilter = 'Виберіть спецільність';

  triger = true;

  public config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1
  };

  refreshFilters() {
    this.searchFilter = '';
    this.facultyFilter = 'Виберіть факультет';
    this.specialityFilter = 'Виберіть спецільність';
  }


  constructor(private groupsService: GroupsService,
              public dialog: MatDialog,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.specialityId) {
        this.specialityId = params.specialityId;
      } else if (params.facultyId) {
        this.facultyId = params.facultyId;
      }
    });
  }

  ngOnInit() {
    if (this.triger) {
      this.getGroupsData();
    }

    this.groupsService.searchFilterService.subscribe(data => this.searchFilter = data);
    this.groupsService.facultyFilterService.subscribe(data => this.facultyFilter = data);
    this.groupsService.specialityFilterService.subscribe(data => this.specialityFilter = data);

  }


  getGroupsData() {
    this.groupsService._getGroup()
      .mergeMap(groupData => {
        this.groups = groupData;
        return this.groupsService._getFaculties();
      })
      .mergeMap((facultyData) => {
        this.faculties = facultyData;
        return this.groupsService._getSpecialities();
      })
      .subscribe(specialityData => {
        this.specialities = specialityData;
        this.fillOutTableArray();
      });
  }

  fillOutTableArray() {
    let tempTriger = false;
    for (let i = 0; i < this.groups.length; i++) {
      this.table.push({
        group_id: parseInt(this.groups[i].group_id, 10),
        group: this.groups[i].group_name,
        faculty: '',
        speciality: ''
      });

      for (const faculty of this.faculties) {
        if (this.groups[i].faculty_id === faculty.faculty_id) {
          this.table[i].faculty = faculty.faculty_name;
          break;
        }
      }

      for (const speciality of this.specialities) {
        if (this.groups[i].speciality_id === speciality.speciality_id) {
          this.table[i].speciality = speciality.speciality_name;
          break;
        }
      }


      if (this.facultyId && tempTriger === false) {
        for (const faculty of this.faculties) {
          if (faculty.faculty_id === this.facultyId) {
            tempTriger = true;
            this.groupsService.changeFacultyFilter(faculty.faculty_name);
          }
        }
      }

      if (this.specialityId && tempTriger === false) {
        for (const speciality of this.specialities) {
          if (speciality.speciality_id === this.specialityId) {
            tempTriger = true;
            this.groupsService.changeSpecialityFilter(speciality.speciality_name);
          }
        }
      }


    }
  }

  // ************* DIALOG *****************
  public openDialog(groupLine ?: Table): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    if (groupLine) {
      dialogConfig.data = {
        group_id: groupLine.group_id,
        group: groupLine.group,
        faculty: groupLine.faculty,
        speciality: groupLine.speciality
      };
    } else if (!groupLine) {
      dialogConfig.data = {
        group_id: null
      };
    }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    // IF GET DATA WE EDIT GROUP ELSE WE ADD GROUP
    dialogRef.afterClosed().subscribe(resultDialog => {
      if (!groupLine) {
        if (resultDialog !== undefined) {
          this.addGroup(resultDialog);
        }
      } else if (groupLine) {
        if (resultDialog !== undefined) {
          this.editGroup(resultDialog);
        }
      }
    });
  }

  delGroup(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
        message: 'Ви справді бажаєте видалити групу?'
    };

    const dialogRef = this.dialog.open(DeleteConfirmComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(resultDialog => {

      if (resultDialog === true) {
        this.groupsService._delGroup(id).subscribe(response => {

          if (response.response === 'ok') {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: 'Група була успішно видалена!'
              }
            });
            for (let i = 0; i < this.table.length; i++) {
              if (this.table[i].group_id === id) {
                this.table.splice(i, 1);
              }
            }
          }
        }, error => {
          this.dialog.open(ResponseMessageComponent, {
            width: '400px',
            data: {
              message: 'Виникла помилка при видаленні групи!'
            }
          });
          console.error('Виникла помилка при видаленні групи: ' + error);
        });
      }
    });
  }
  // ********** END OF DIALOG *************


  // GET DATA FROM DIALOG, SEND (POST) TO SERVER WITH NEW DATA, GET RESPONSE, AND PUSH DATA TO TABLE.
  addGroup(groupData) {
    let tempFacultyId;
    let tempSpecialityId;
    let addGroupData: AddGroup;

    for (const faculty of this.faculties) {
      if (groupData.faculty === faculty.faculty_name) {
        tempFacultyId = faculty.faculty_id;
        break;
      }
    }
    for (const speciality of this.specialities) {
      if (groupData.speciality === speciality.speciality_name) {
        tempSpecialityId = speciality.speciality_id;
        break;
      }
    }

    addGroupData = {
      group_name: groupData.group_name,
      speciality_id: tempSpecialityId,
      faculty_id: tempFacultyId,
    };

    this.groupsService._addGroup(addGroupData).subscribe(response => {
      this.dialog.open(ResponseMessageComponent, {
        width: '400px',
        data: {
          message: 'Група була успішно додана!'
        }
      });
      if (response[0].group_name === groupData.group_name) {
        this.table.push({
          group_id: parseInt(response[0].group_id, 10),
          group: response[0].group_name,
          faculty: groupData.faculty,
          speciality: groupData.speciality
        });
      }
    }, error => {
      this.dialog.open(ResponseMessageComponent, {
        width: '400px',
        data: {
          message: 'Помилка при додаванні групи!'
        }
      });
      console.error('Виникла помилка при додаванні групи: ' + error);
    });
  }

  // EDIT GROUP
  editGroup(groupData) {
    let tempFaculty;
    let tempSpeciality;
    let tempFacultyId;
    let tempSpecialityId;
    let editGroupData: AddGroup;

    for (const faculty of this.faculties) {
      if (groupData.faculty === faculty.faculty_name) {
        tempFacultyId = faculty.faculty_id;
        break;
      }
    }
    for (const speciality of this.specialities) {
      if (groupData.speciality === speciality.speciality_name) {
        tempSpecialityId = speciality.speciality_id;
        break;
      }
    }
    editGroupData = {
      group_id: groupData.group_id,
      group_name: groupData.group_name,
      speciality_id: tempSpecialityId,
      faculty_id: tempFacultyId,
    };
    for (const table of this.table) {
      if (table.group_id === groupData.group_id) {
        if (table.group !== groupData.group_name && table.faculty !== tempFaculty && table.speciality !== tempSpeciality) {

          this.groupsService._editGroup(editGroupData).subscribe(response => {
            if (parseInt(response[0].group_id, 10) === groupData.group_id) {
              this.groupsService._getFaculty(response[0].faculty_id).subscribe(facResponse => {
                tempFaculty = facResponse[0].faculty_name;
                this.groupsService._getSpeciality(response[0].speciality_id).subscribe(specResponse => {
                  tempSpeciality = specResponse[0].speciality_name;

                  this.dialog.open(ResponseMessageComponent, {
                    width: '400px',
                    data: {
                      message: 'Група була успішно редагована!'
                    }
                  });

                  table.group = groupData.group_name;
                  table.faculty = tempFaculty;
                  table.speciality = tempSpeciality;
                });
              });
            } else {
              this.dialog.open(ResponseMessageComponent, {
                width: '400px',
                data: {
                  message: 'Помилка приредагуванні групи!'
                }
              });
            }
          });
        }
      }
    }
  }

  goTimetable(id): void {
    this.router.navigate(['admin/timetable'], {queryParams: {groupId: id}});
  }
  goResults(id): void {
    this.router.navigate(['admin/results'], {queryParams: {groupId: id}});
  }

  // clearRouterParams() {
  //   console.log('Changed');
  //   if (this.specialityId || this.specialityId) {
  //     console.log(true);
  //     this.router.navigate(['/'], {relativeTo: this.activatedRoute});
  //   }
  // }

}
