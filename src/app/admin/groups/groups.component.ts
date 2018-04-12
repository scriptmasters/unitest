import { DialogComponent } from './dialog/dialog.component';
import { GroupsService } from './groups.service';
import { Component, OnInit, group, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { Table, Groups, Faculties, Specialities, AddGroup, DelGroup } from './interface';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  providers: [GroupsService]
})
export class GroupsComponent implements OnInit {
  groups: Groups[] = [];
  faculties: Faculties[] = [];
  specialities: any = [];
  table: Table[] = [];
  uniqueFac;
  uniqueSpec;

  makeUnique = (): void => {
    let uniqueFac = [], uniqueSpec = [];
    for (let i = 0; i < this.table.length; i++) {
      uniqueFac[i] = this.table[i].faculty;
      uniqueSpec[i] = this.table[i].speciality;
    }
    this.uniqueFac = new Set(uniqueFac);
    this.uniqueSpec = new Set(uniqueSpec);
  }

  constructor(private groupsService: GroupsService, public dialog: MatDialog) { }

  printOut() {
    this.groupsService._getGroup().subscribe(groupData => {
      this.groups = groupData;
      let arrFaculty = [];
      let arrSpeciality = [];
      console.log("GROUP DATA");
      console.log(groupData);
      for (let i = 0; i < this.groups.length; i++) {
        arrFaculty.push(groupData[i].faculty_id);
        arrSpeciality.push(groupData[i].speciality_id);
      }
      this.groupsService._getFaculties().subscribe(facultyData=>{
        this.faculties = facultyData;

        this.groupsService._getSpecialities().subscribe(specialityData=>{
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
          this.makeUnique();
        })
      })
    });
  }

  // DELETE GROUP 
  delGroup(id) {
    this.groupsService._delGroup(id).subscribe(response => {
      if (response.response === "ok") {
        for (let i = 0; i < this.table.length; i++) {
          if (this.table[i].group_id === id) {
            this.table.splice(i, 1);
          }
        }
      }
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
        this.editGroup(resultDialog);
      }
    });
  }
  // ********** END OF DIALOG *************

  // GET DATA FROM DIALOG, SEND (POST) TO SERVER WITH NEW DATA, GET RESPONSE, AND PUSH DATA TO TABLE.
  addGroup(groupData) {
    let tempFacultyId;
    let tempSpecialityId;
    let addGroupData: AddGroup;
    console.log(groupData);

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
      console.log("RESPONSE");
      console.log(response);
      if (response[0].group_name == groupData.group_name) {
        this.table.push({
          group_id: parseInt(response[0].group_id),
          group: response[0].group_name,
          faculty:groupData.faculty,
          speciality: groupData.speciality
        })
      }
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

      this.groupsService._getFaculty(response[0].faculty_id).subscribe(facResponse => {
        tempFaculty = facResponse[0].faculty_name;
        this.groupsService._getSpeciality(response[0].speciality_id).subscribe(specResponse => {
          tempSpeciality = specResponse[0].speciality_name;
          
          for (let table of this.table) {
            if (table.group_id == groupData.group_id) {
              table.group = groupData.group_name;
              table.faculty = tempFaculty;
              table.speciality = tempSpeciality;
            }
          }
        })
      })
    })
  }


  ngOnInit() {
    this.printOut();
  }

}
