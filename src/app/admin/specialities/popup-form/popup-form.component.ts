import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {SpecialityService} from '../speciality.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Speciality} from '../specialityInterface';
import { TranslateService } from '@ngx-translate/core';

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
                private speciality: SpecialityService, private translate: TranslateService) {
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
            this.translate.get('ADMIN.SPEC.EDITED').subscribe(msg => {
                this.speciality.editSpecialities(id, formData.code, formData.name)
                .subscribe(() =>
                        this.matDialogRef.close({status: 'SUCCESS', message: msg}),
                    () => {
                        this.translate.get('ADMIN.TEST.NCHANGES').subscribe(m => {
                            this.matDialogRef.close({status: 'ERROR', message: m});
                        });
                    }
                );
            });
        } else {
            this.translate.get('ADMIN.SPEC.ADDED').subscribe(me => {
                this.speciality.addSpecialities(formData.code, formData.name)
                .subscribe(() =>
                        this.matDialogRef.close({status: 'SUCCESS', message: me}),
                    () => {
                        this.translate.get('ADMIN.SPEC.EXIST').subscribe(ms => {
                            this.matDialogRef.close({status: 'ERROR', message: ms});
                        });
                    }
                );
            });
        }
    }

    closeDialog(): void {
        this.matDialogRef.close();
    }
}
