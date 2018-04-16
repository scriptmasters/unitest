import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from './dialog/dialog.component';
import { GroupsService } from './groups.service';
import { Component, OnInit, group, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { Table, Groups, Faculties, Specialities, AddGroup, DelGroup } from './interface';
import { GroupsDeleteConfirmComponent } from './groups-delete-confirm/groups-delete-confirm.component';
import { Router } from '@angular/router'
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { PaginationInstance } from 'ngx-pagination';

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

  public config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(private groupsService: GroupsService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }
  
  printOut(param?:any) {
    this.groupsService._getGroup().subscribe(groupData => {
      this.groups = groupData;
      let arrFaculty = [];
      let arrSpeciality = [];

      for (let i = 0; i < this.groups.length; i++) {
        arrFaculty.push(groupData[i].faculty_id);
        arrSpeciality.push(groupData[i].speciality_id);
      }
      this.groupsService._getFaculties().subscribe(facultyData => {
        this.faculties = facultyData;

        this.groupsService._getSpecialities().subscribe(specialityData => {
          this.specialities = specialityData;

          for (let i = 0; i < this.groups.length; i++) {
            this.table.push({
              group_id: parseInt(this.groups[i].group_id),
              group: this.groups[i].group_name,
              faculty: '',
              speciality: ''
            })

            for (let faculty of this.faculties) {
              if (this.groups[i].faculty_id === faculty.faculty_id) {
                this.table[i].faculty = faculty.faculty_name;
                break;
              }
            }

            for (let speciality of this.specialities) {
              if (this.groups[i].speciality_id === speciality.speciality_id) {
                this.table[i].speciality = speciality.speciality_name;
                break;
              }
            }
          }
          // this.makeUnique();
        })
      })
    });
  }



  // ************* DIALOG *****************
  addedGroup: AddGroup;

  public openDialog(groupLine?: Table): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    if (groupLine) {
      dialogConfig.data = {
        group_id: groupLine.group_id,
        group: groupLine.group,
        faculty: groupLine.faculty,
        speciality: groupLine.speciality
      }
    }
    else if (!groupLine) {
      dialogConfig.data = {
        group_id: null
      }
    }

    let dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    //IF GET DATA WE EDIT GROUP ELSE WE ADD GROUP
    dialogRef.afterClosed().subscribe(resultDialog => {
      if (!groupLine) {
        this.addGroup(resultDialog);
      } else if (groupLine) {
        if (resultDialog !== undefined) {
          this.editGroup(resultDialog);
        }
      }
    });
  }

  delGroup(id) {
    let confirm: boolean;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    let dialogRef = this.dialog.open(GroupsDeleteConfirmComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(resultDialog => {
    
      if (resultDialog === true) {
        this.groupsService._delGroup(id).subscribe(response => {
     
          if (response.response === "ok") {
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
          })
            ;
        });
      }
    })
    return confirm;
  }
  // ********** END OF DIALOG *************


  // GET DATA FROM DIALOG, SEND (POST) TO SERVER WITH NEW DATA, GET RESPONSE, AND PUSH DATA TO TABLE.
  addGroup(groupData) {
    let tempFacultyId;
    let tempSpecialityId;
    let addGroupData: AddGroup;


    for (let faculty of this.faculties) {
      if (groupData.faculty === faculty.faculty_name) {
        tempFacultyId = faculty.faculty_id;
        break;
      }
    }
    for (let speciality of this.specialities) {
      if (groupData.speciality === speciality.speciality_name) {
        tempSpecialityId = speciality.speciality_id;
        break;
      }
    }

    addGroupData = {
      group_name: groupData.group_name,
      speciality_id: tempSpecialityId,
      faculty_id: tempFacultyId,
    }

    this.groupsService._addGroup(addGroupData).subscribe(response => {
      this.dialog.open(ResponseMessageComponent, {
        width: '400px',
        data: {
          message: 'Група була успішно додана!'
        }
      });
      if (response[0].group_name == groupData.group_name) {
        this.table.push({
          group_id: parseInt(response[0].group_id),
          group: response[0].group_name,
          faculty: groupData.faculty,
          speciality: groupData.speciality
        })
      }
    }, error => {
      this.dialog.open(ResponseMessageComponent, {
        width: '400px',
        data: {
          message: 'Помилка при додаванні групи!'
        }
      });
    })
  }

  // EDIT GROUP
  editGroup(groupData) {
    let tempFaculty;
    let tempSpeciality;
    let tempFacultyId;
    let tempSpecialityId;
    let editGroupData: AddGroup;

    for (let faculty of this.faculties) {
      if (groupData.faculty === faculty.faculty_name) {
        tempFacultyId = faculty.faculty_id;
        break;
      }
    }
    for (let speciality of this.specialities) {
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
    }

    this.groupsService._editGroup(editGroupData).subscribe(response => {
 
      if (response[0].group_id == groupData.group_id) {
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

            for (let table of this.table) {
              if (table.group_id == groupData.group_id) {
                table.group = groupData.group_name;
                table.faculty = tempFaculty;
                table.speciality = tempSpeciality;
              }
            }
          })
        })
      } else {
        this.dialog.open(ResponseMessageComponent, {
          width: '400px',
          data: {
            message: 'Помилка приредагуванні групи!'
          }
        });
      }
    })
  }

  goTimetabel(id): void {
    this.router.navigate(['admin/timetable'], { queryParams: { groupId: id } });
  }

  goStudents(id): void {
    this.router.navigate(['admin/students/' + id]);
  }

  facultyId: string;
  specialityId: string;

  


  ngOnInit() {
    this.printOut();

    

  }

}
