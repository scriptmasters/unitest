import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { StudentsService } from '../students.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import IGroup from '../interfaces/IGroup';
import IFaculty from '../interfaces/IFaculty';
import IStudent from '../interfaces/IStudent';
import IUser from '../interfaces/IUser';
import IResponse from '../interfaces/IResponse';
import { defaultImage } from './default-image';
import { ValidateLoginNotTaken } from '../async-login.validator';

@Component({
  selector: 'app-students-modal-window',
  templateUrl: './students-modal-window.component.html',
  styleUrls: ['./students-modal-window.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudentsModalWindowComponent implements OnInit {

  form;
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

  constructor(
    private service: StudentsService,
    public dialogRef: MatDialogRef<StudentsModalWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.getData();
    }

  ngOnInit(): void {
    // Form validation
    this.createFormControls();
    this.createForm();
  }
  // create form controls
  createFormControls() {
    this.firstnameC = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]);
    this.surnameC = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]);
    this.fnameC = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]);
    this.gradebookC = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20)
    ]);
    this.groupC = new FormControl(this.data.updating ?
      null : 'Виберіть групу', this.selectGroupValidator.bind(this));
    this.facultyC = new FormControl(this.data.updating ?
      null : 'Виберіть факультет', this.selectFacultyValidator.bind(this));
    this.loginC = new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(32)
      ],
      asyncValidators: ValidateLoginNotTaken.createValidator(this.service),
      updateOn: 'blur'
    });
    this.emailC = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32),
      Validators.email
    ]);
    this.passwordC =  new FormControl(this.data.updating ?
      this.data.student.plain_password : '', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32)
    ]));
    this.password_confirmC = new FormControl(this.data.updating ?
      this.data.student.plain_password : '', this.matchOtherValidator('password'));
  }
  // create Form validation
  createForm() {
    this.form = new FormGroup({
      firstname: this.firstnameC,
      surname: this.surnameC,
      fname: this.fnameC,
      group: this.groupC,
      faculty: this.facultyC,
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
      });
    }
  }
  // Getting available groups for picked faculty by faculty ID
  getGroups(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    if (this.data.updating) {
      if (value === 'Виберіть факультет') {
        return;
      }
    }
    let index: string;
    // Iterate array to find neccessary faculty id
    this.faculties.forEach(val => {
      if (val.faculty_name === value) {
        index = val.faculty_id;
      }
    });
    // Request for the available groups
    this.service.getAvailableGroups(index).subscribe(data => {
      if (data[0]) {
        this.groups = data;
      // if there is no available group
      } else {
        this.groups = [];
      }
    });
  }
  // set group id to student object value when group name is picked
  handleSetGroup(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    if (value === 'Виберіть групу') {
      return;
    }
    let index: string;
    this.groups.forEach(val => {
      if (val.group_name === value) {
        index = val.group_id;
      }
    });
    this.student.group_id = index;
  }
  // custom group validator
  selectGroupValidator(control) {
    if (control.value === 'Немає груп' || control.value === 'Виберіть групу') {
      return {
        'group': true
      };
    }
  }
  // custom faculty validator
  selectFacultyValidator(control) {
    if (control.value === 'Виберіть факультет') {
      return {
        'faculty': true
      };
    }
  }
  // rendering photo to base64 code befor it's sent to the server
  handleAddPhoto(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      this.student.photo = dataURL;
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
  // Passwod confirm validator
  matchOtherValidator = (otherControlName: string) => {

    let thisControl: FormControl;
    let otherControl: FormControl;

    return (control: FormControl) => {

      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!otherControl) {
        return null;
      }

      if (otherControl.value !== thisControl.value) {
        return {
          matchOther: true
        };
      }

      return null;

    };
  }
}
