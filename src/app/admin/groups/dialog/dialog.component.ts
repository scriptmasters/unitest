import {GroupsService} from '../groups.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';


@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
    faculty = '';
    speciality = '';
    group = '';

    facultiesArr = [];
    specialitiesArr = [];

    myForm: FormGroup;
    facultyValid: FormControl;
    specialityValid: FormControl;
    groupValid: FormControl;

    constructor(private groupsService: GroupsService,
                private dialogRef: MatDialogRef<DialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        console.log(data);
        if (data.group_id !== null) {
            this.group = data.group;
            this.faculty = data.faculty;
            this.speciality = data.speciality;
        }
    }

    dropDownsData(): void {
        this.groupsService._getFaculties().subscribe(facData => {
            this.facultiesArr = facData;
            this.groupsService._getSpecialities().subscribe(specData => {
                this.specialitiesArr = specData;
                this.group = this.data.group;
            });
        });
    }

    public close() {
        this.dialogRef.close({
            faculty: this.faculty,
            speciality: this.speciality,
            group_name: this.group,
            group_id: this.data.group_id
        });
    }

    handleClose() {
        this.dialogRef.close();
    }

    createFormControls() {
        this.facultyValid = new FormControl('', Validators.required);
        this.specialityValid = new FormControl('', Validators.required);
        this.groupValid = new FormControl('', {
            validators:
                [
                    Validators.required,
                    Validators.pattern('^([А-ЯІЇ]){2,3}-[0-9]{2}-[0-9]{1}'),
                ],
            updateOn: 'blur'
        });
    }

    createForm() {
        this.myForm = new FormGroup({
            facultyValid: this.facultyValid,
            specialityValid: this.specialityValid,
            groupValid: this.groupValid,
        });
    }

    ngOnInit() {
        this.dropDownsData();
        this.createFormControls();
        this.createForm();
    }

}
