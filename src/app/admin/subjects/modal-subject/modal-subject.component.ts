import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {SubjectService} from '../services/subject.service';
import {Subject} from '../subject';

@Component({
    selector: 'app-modal-subject',
    templateUrl: './modal-subject.component.html',
    styleUrls: ['./modal-subject.component.scss'],
})
export class ModalSubjectComponent implements OnInit {
    subject = [{subject_name: '', subject_description: '', subject_id: undefined}];
    form: FormGroup;
    isLoaded = true;

    constructor(private route: ActivatedRoute,
                private matDialogRef: MatDialogRef<ModalSubjectComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private subjectService: SubjectService) {
    }

    ngOnInit() {
        this.getSubject();

        this.form = new FormGroup({
            title: new FormControl(null, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ]),
            description: new FormControl(null, [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
            ]),
        });
    }

    getSubject(): void {
        if (this.data.subject_id) {
            this.isLoaded = false;
            const id = this.data.subject_id;
            this.subjectService.getSubjectById(id).subscribe((subject: Subject[]) => {
                this.subject = subject;
                this.isLoaded = true;
            });
        }
    }

    onSubmit() {
        const formData = this.form.value;

        if (this.data.subject_id) {
            const id = this.data.subject_id;
            this.subjectService
                .editSubject(id, formData.title, formData.description)
                .subscribe(
                    () =>
                        this.matDialogRef.close({
                            status: 'SUCCESS',
                            message: 'Предмет було успішно відредаговано!',
                        }),
                    () =>
                        this.matDialogRef.close({
                            status: 'ERROR',
                            message: 'Виникла помилка при редагуванні предмета!',
                        })
                );
        } else {
            this.subjectService
                .addSubject(formData.title, formData.description)
                .subscribe(
                    () =>
                        this.matDialogRef.close({
                            status: 'SUCCESS',
                            message: 'Предмет було успішно додано!',
                        }),
                    () =>
                        this.matDialogRef.close({
                            status: 'ERROR',
                            message: 'Виникла помилка при додаванні предмета!',
                        })
                );
        }
    }

    closeDialog(): void {
        this.matDialogRef.close();
    }
}
