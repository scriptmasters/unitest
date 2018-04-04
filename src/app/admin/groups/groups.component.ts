import { DialogComponent } from './dialog/dialog.component';
import { GroupsService } from './groups.service';
import { Component, OnInit, group, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { Table, Groups, Faculties, Specialities, AddedGroup, DelGroup } from './interface';

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
  
  makeUnique = ():void =>{
    let uniqueFac = [], uniqueSpec = []; 
    for(let i = 0; i< this.table.length; i++){
      uniqueFac[i] = this.table[i].faculty;
      uniqueSpec[i] = this.table[i].speciality;
    }
    this.uniqueFac = new Set(uniqueFac);
    this.uniqueSpec = new Set(uniqueSpec);
  }
  
  
  

  constructor(private groupsService: GroupsService, public dialog: MatDialog ) { }
 
  printOut(){
    this.groupsService._getGroup().subscribe(groupData => {
      this.groups = groupData;
      let arrFaculty = [];
      let arrSpeciality = [];

      for (let i = 0; i < this.groups.length; i++) {
        arrFaculty.push(groupData[i].faculty_id);
        arrSpeciality.push(groupData[i].speciality_id);
      }
      console.log(groupData);

      let facultyBody = ({entity: "Faculty", ids: arrFaculty});
      this.groupsService._getFacultysByEntityManager(facultyBody).subscribe(facultyData => {
        this.faculties = facultyData;
        console.log(facultyData);

        let specialityBody = ({entity: "Speciality", ids: arrSpeciality});
        this.groupsService._getSpecialitiesByEntityManager(specialityBody).subscribe(specialityData => {
          this.specialities = specialityData;  

          for (let i = 0; i<this.groups.length; i++) {
            this.table.push({
              group_id: parseInt(this.groups[i].group_id),
              group: this.groups[i].group_name,
              faculty: '',
              speciality: ''
            })
      
            for (let faculty of this.faculties) {
              if (this.groups[i].faculty_id === faculty.faculty_id){
                this.table[i].faculty = faculty.faculty_name;
                break;
              }
            }
            
            for (let speciality of this.specialities) {
              if (this.groups[i].speciality_id === speciality.speciality_id){
                this.table[i].speciality = speciality.speciality_name;
                break;
              }
            }
          }
          this.makeUnique();
          console.log("TABLE : " + JSON.stringify(this.table));
          
        }); 
      });
    });
  } 

  // DELETE SOME GROUP 
  delGroup(id){
    this.groupsService._delGroup(id).subscribe(response => console.log("RESPONSE = " + response));
    console.log("ID="+id);
    for(let i=0; i<this.table.length; i++){
      if(this.table[i].group_id === id){
        this.table.splice(i ,1);
      }
    }
  }



  // ************* DIALOG *****************
  addedFacultyName: string = "";
  addedSpecialityName: string = "";
  addedGroupName: number;
  addedGroup: AddedGroup = {
    faculty: "",
    speciality: "",
    group: ""
  };

  public openDialog(): void{
    
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      fac: this.faculties,
      spec: this.specialities
    }

    let dialogRef = this.dialog.open(DialogComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addedFacultyName = result.faculty;
      this.addedSpecialityName = result.speciality;
      this.addedGroupName = result.group;

      this.addedGroup.faculty = result.faculty;
      this.addedGroup.speciality = result.speciality;
      this.addedGroup.group = result.group;

      // this.table.push({})
      
    });
  }

  // ********** END OF DIALOG *************

  ngOnInit() {
      this.printOut();
  }

}
