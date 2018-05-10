import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {SpecialityService} from '../speciality.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Speciality} from '../specialityInterface';

@Component({
    selector: 'app-popup-form',
    templateUrl: './popup-form.component.html',
    styleUrls: ['./popup-form.component.scss']
})
export class PopupFormComponent implements OnInit {
    specialitys = [{speciality_code: '', speciality_name: ''}];
    form: FormGroup;
    isLoaded = true;

    constructor(private matDialogRef: MatDialogRef<PopupFormComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private speciality: SpecialityService) {
    }

    ngOnInit() {
        this.getSpeciality();
        this.form = new FormGroup({
            'code': new FormControl(null, [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('([0-9\.])+')
            ]),
            'name': new FormControl(null, [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('([A-Za-zА-Яа-яюЮЄєІіЇї -])+')
            ])
        }, {updateOn: 'blur'});
    }

    getSpeciality(): void {
        if (this.data.speciality_id) {
            this.isLoaded = false;
            const id = this.data.speciality_id;
            this.speciality.getSpecialitiesId(id)
                .subscribe((speciality: Speciality[]) => {
                    this.specialitys = speciality;
                    this.isLoaded = true;
                });
        }
    }

    onSubmit() {
        const formData = this.form.value;
        if (this.data.speciality_id) {
            const id = this.data.speciality_id;
            this.speciality.editSpecialities(id, formData.code, formData.name)
                .subscribe(() =>
                        this.matDialogRef.close({status: 'SUCCESS', message: 'Спеціальність було успішно відредаговано!'}),
                    () => this.matDialogRef.close({status: 'ERROR', message: 'Ви не внесли ніяких змін при редагуванні!'})
                );
        } else {
            this.speciality.addSpecialities(formData.code, formData.name)
                .subscribe(() =>
                        this.matDialogRef.close({status: 'SUCCESS', message: 'Спеціальність було успішно додано!'}),
                    () => this.matDialogRef.close({status: 'ERROR', message: 'Спеціальність з такою назвою вже існує!'})
                );
        }
    }

    closeDialog(): void {
        this.matDialogRef.close();
    }
}
