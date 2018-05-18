import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {StudentsService} from '../students.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import IGroup from '../interfaces/IGroup';
import IFaculty from '../interfaces/IFaculty';
import IStudent from '../interfaces/IStudent';
import IUser from '../interfaces/IUser';
import IResponse from '../interfaces/IResponse';
import {defaultImage} from './default-image';
import {ValidateLoginNotTaken} from '../custom-validators/async-login.validator';
import {ValidateEmailNotTaken} from '../custom-validators/async-email.validator';
import {matchOtherValidator} from '../custom-validators/password-confirm.validator';
import {getGroupsByFaulty} from '../reusable-functions/get-groups-by-faculty';
import {setGroupAsID} from '../reusable-functions/set-group-as-id';

@Component({
    selector: 'app-students-modal-window',
    templateUrl: './students-modal-window.component.html',
    styleUrls: ['./students-modal-window.component.scss']
})
export class StudentsModalWindowComponent implements OnInit {

    isValidGroupFiefd = true;
    form;
    chooseGroup = '';
    groups: IGroup[] = [];
    faculties: IFaculty[] = [];
    student: IStudent = {
        user_id: '',
        gradebook_id: '',
        student_surname: '',
        student_name: '',
        student_fname: '',
        group_id: '',
        plain_password: '',
        photo: defaultImage,
        password_confirm: ''
    };
    studentInfo: IUser = {
        id: '',
        username: '',
        password: '',
        logins: '',
        last_login: '',
        email: ''
    };
    studentGroup: IGroup = {
        group_id: '',
        group_name: '',
        speciality_id: '',
        faculty_id: ''
    };
    studentFaculty: IFaculty = {
        faculty_id: '',
        faculty_name: '',
        faculty_description: ''
    };
    // form controls
    firstnameC: FormControl;
    surnameC: FormControl;
    fnameC: FormControl;
    gradebookC: FormControl;
    groupC: FormControl;
    facultyC: FormControl;
    loginC: FormControl;
    emailC: FormControl;
    passwordC: FormControl;
    password_confirmC: FormControl;

    constructor(private service: StudentsService,
                public dialogRef: MatDialogRef<StudentsModalWindowComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit(): void {
        this.getData();
        // Form validation
        if (this.data.updating || this.data.creating) {
            this.createFormControls();
            this.createForm();
        }
    }

    // create form controls
    createFormControls() {
        this.firstnameC = new FormControl('', [
            Validators.required,
            Validators.pattern('^([A-ZА-ЯІЇ]){1}([a-zа-яії]){1,15}')
        ]);
        this.surnameC = new FormControl('', [
            Validators.required,
            Validators.pattern('^([A-ZА-ЯІЇ]){1}([a-zа-яії]){1,15}')
        ]);
        this.fnameC = new FormControl('', [
            Validators.required,
            Validators.pattern('^([A-ZА-ЯІЇ]){1}([a-zа-яії]){2,15}')
        ]);
        this.gradebookC = new FormControl('', [
            Validators.required,
            Validators.pattern('^([A-ZА-ЯІЇa-zа-яії]){2,4}-([0-9]){1,10}')
        ]);
        this.groupC = new FormControl(this.data.updating ?
            '' : 'Виберіть групу', this.selectGroupValidator());
        this.facultyC = new FormControl(this.data.updating ?
            null : 'Виберіть факультет', this.selectFacultyValidator);
        this.loginC = new FormControl('', {
            validators: [
                Validators.required,
                Validators.pattern('^\\w{5,20}')
            ],
            asyncValidators: this.data.updating ?
                ValidateLoginNotTaken.createValidator(this.service, true) :
                ValidateLoginNotTaken.createValidator(this.service, false),
            updateOn: 'blur'
        });
        this.emailC = new FormControl('', {
            validators: [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(32),
                Validators.email
            ],
            asyncValidators: this.data.updating ?
                ValidateEmailNotTaken.createValidator(this.service, true) :
                ValidateEmailNotTaken.createValidator(this.service, false),
            updateOn: 'blur'
        });
        this.passwordC = new FormControl(this.data.updating ?
            this.data.student.plain_password : '', [
            Validators.required,
            Validators.pattern('^\\S{8,32}')
        ]);
        this.password_confirmC = new FormControl(this.data.updating ?
            this.data.student.plain_password : '', matchOtherValidator('password'));
    }

    // create Form validation
    createForm() {
        this.form = new FormGroup({
            firstname: this.firstnameC,
            surname: this.surnameC,
            fname: this.fnameC,
            groupFC: this.groupC,
            facultyFC: this.facultyC,
            gradebook: this.gradebookC,
            login: this.loginC,
            password: this.passwordC,
            password_confirm: this.password_confirmC,
            email: this.emailC
        });
    }

    // Get data from server
    getData() {
        if (this.data.updating || this.data.reading) {
            // Requests for updating and checking student info
            this.service.getPickedStudent(this.data.student.user_id).subscribe(data => {
                this.student = data[0];
                this.student.password_confirm = data[0].plain_password;
            });
            this.service.getUserInfo(this.data.student.user_id).subscribe(response => {
                this.studentInfo = response[0];
            });
            const group = JSON.stringify({entity: 'Group', ids: [this.data.student.group_id]});
            this.service.getEntityValue(group).subscribe(resp => {
                this.studentGroup = resp[0];
            });
            const faculty = JSON.stringify({entity: 'Faculty', ids: [this.data.student.faculty_id]});
            this.service.getEntityValue(faculty).subscribe(val => {
                this.studentFaculty = val[0];
            });
            if (this.data.updating) {
                this.service.getAvailableFaculties().subscribe(value => {
                    this.faculties = value;
                });
                this.service.getAvailableGroups(this.data.student.faculty_id).subscribe(values => {
                    this.groups = values;
                });
            }
        }
        // Initial request for creating student profile
        if (this.data.creating) {
            this.service.getAvailableFaculties().subscribe(response => {
                this.faculties = response;
                this.facultyC.updateValueAndValidity();
                this.groupC.updateValueAndValidity();
            });
        }
    }

    // Getting available groups for picked faculty by faculty ID
    getGroups(elem: HTMLSelectElement) {
        const index = getGroupsByFaulty(elem, this.data.updating, this.faculties);
        if (index) {
            // if we are editing the student and wanting to choose another group for him
            // the form is gonna be invalid 'till we've choosen any group out of drop down list
            if (this.facultyC.touched) {
                this.chooseGroup = 'Виберіть групу';
                this.groupC.updateValueAndValidity();
            }
            // Request for the available groups
            this.service.getAvailableGroups(index).subscribe(data => {
                if (data[0]) {
                    this.groups = data;
                    this.isValidGroupFiefd = true;
                    this.groupC.updateValueAndValidity();
                    // if there is no available group
                } else {
                    this.groups = [];
                    this.isValidGroupFiefd = false;
                    this.groupC.updateValueAndValidity();
                }
            });
        }
    }

    // set group id to student object value when group name is picked
    handleSetGroup(elem: HTMLSelectElement) {
        const index = setGroupAsID(elem, this.groups);
        this.groupC.updateValueAndValidity();
        if (index) {
            this.student.group_id = index;
        }
    }

    // custom group validator
    selectGroupValidator = () => {
        return (control: FormControl) => {
            if (control.value === 'Виберіть групу' || !this.isValidGroupFiefd) {
                return {
                    'group': true
                };
            }
            return null;
        };
    }

    // custom faculty validator
    selectFacultyValidator(control: FormControl) {
        if (control.value === 'Виберіть факультет') {
            return {
                'faculty': true
            };
        }
        return null;
    }

    // rendering photo to base64 code befor it's sent to the server
    handleAddPhoto(event) {
        const input = event.target;
        const reader = new FileReader();
        reader.onload = () => {
            this.student.photo = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }

    // Submitting form
    handleSubmit(value) {
        const studentJSON = JSON.stringify({
            gradebook_id: value.gradebook,
            student_surname: value.surname,
            student_name: value.firstname,
            student_fname: value.fname,
            group_id: this.student.group_id,
            password: value.password,
            username: value.login,
            email: value.email,
            photo: this.student.photo,
            password_confirm: value.password_confirm,
            plain_password: value.password
        });
        if (this.data.updating) {
            this.service.editStudent(this.data.student.user_id, studentJSON).subscribe(
                (data: IResponse) => this.dialogRef.close(data),
                error => this.dialogRef.close(error)
            );
            return;
        }
        this.service.addStudent(studentJSON).subscribe(
            (data: IResponse) => this.dialogRef.close(data),
            error => this.dialogRef.close(error)
        );
    }

    // To see a password
    handleTogglePasswordVisibility(event: Event) {
        const elem = event.srcElement.previousElementSibling;
        if (elem.getAttribute('type') === 'password') {
            elem.setAttribute('type', 'text');
        } else {
            elem.setAttribute('type', 'password');
        }
    }

    // close mat dialog window
    handleClose(): void {
        this.dialogRef.close();
    }
}
