import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {SubjectService} from '../services/subject.service';
import {Subject} from '../subject';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-modal-subject',
    templateUrl: './modal-subject.component.html',
    styleUrls: ['./modal-subject.component.scss'],
})
export class ModalSubjectComponent implements OnInit {
    subject = [{subject_name: '', subject_description: '', subject_id: undefined}];
    form: FormGroup;
    isLoaded = true;
    edited;
    editError;
    added;
    addErr;
    constructor(private route: ActivatedRoute,
                private matDialogRef: MatDialogRef<ModalSubjectComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private subjectService: SubjectService,
                private translate: TranslateService) {
                    translate.get('ADMIN.SUBJ.EDITED').subscribe(msg => {
                        this.edited = msg;
                    });
                    translate.get('ADMIN.SUBJ.ERREDIT').subscribe(msg => {
                        this.editError = msg;
                    });
                    translate.get('ADMIN.SUBJ.ADDED').subscribe(msg => {
                        this.added = msg;
                    });
                    translate.get('ADMIN.SUBJ.ADDERR').subscribe(msg => {
                        this.addErr = msg;
                    });
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
                            message: this.edited,
                        }),
                    () =>
                        this.matDialogRef.close({
                            status: 'ERROR',
                            message: this.editError,
                        })
                );
        } else {
            this.subjectService
                .addSubject(formData.title, formData.description)
                .subscribe(
                    () =>
                        this.matDialogRef.close({
                            status: 'SUCCESS',
                            message: this.added,
                        }),
                    () =>
                        this.matDialogRef.close({
                            status: 'ERROR',
                            message: this.addErr,
                        })
                );
        }
    }

    closeDialog(): void {
        this.matDialogRef.close();
    }
}
