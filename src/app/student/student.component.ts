import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {TestPlayerService} from './services/test-player.service';
import {StudentService} from './student.service';
import {UserInfo, TimeTable, Subject, TestInterface} from './test-player/question-interface';
import {Router} from '@angular/router';

@Component({
    selector: 'app-student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
    id: number;
    user = <UserInfo>{};
    subjects = [];

    constructor(public authService: AuthService,
                public studentService: StudentService,
                private router: Router,
                private testPlayerService: TestPlayerService) {
    }

    ngOnInit() {
        this.authService.isLogged().subscribe((response: any) => {
            this.id = response.id;
            this.getRecords();
        });
    }

    getRecords() {
        this.studentService.getRecords(this.id).subscribe((responses: any) => {
            responses.forEach(item => {
                this.user.gradebook_id = item.gradebook_id;
                this.user.group_id = item.group_id;
                this.user.photo = item.photo;
                this.user.student_fname = item.student_fname;
                this.user.student_name = item.student_name;
                this.user.student_surname = item.student_surname;
                this.user.user_id = item.user_id;
                this.getRecordsGroup();
                this.getTimeTablesForGroup();
                this.user.ready = true;
            });
        });
    }

    getRecordsGroup() {
        this.studentService.getRecordsGroup(this.user.group_id).subscribe((response: any) => {
            response.forEach(item => {
                this.user.group_name = item.group_name;
                this.user.speciality_id = item.speciality_id;
                this.user.faculty_id = item.faculty_id;
                this.getRecordsSpeciality();
                this.getRecordsFaculty();
            });
        });
    }

    getRecordsSpeciality() {
        this.studentService.getRecordsSpeciality(this.user.speciality_id).subscribe((response: any) => {
            response.forEach(item => {
                this.user.speciality_code = item.speciality_code;
                this.user.speciality_name = item.speciality_name;
            });
        });
    }

    getRecordsFaculty() {
        this.studentService.getRecordsFaculty(this.user.faculty_id).subscribe((response: any) => {
            response.forEach(item => {
                this.user.faculty_name = item.faculty_name;
            });
        });
    }

    getTimeTablesForGroup() {
        this.studentService.getTimeTablesForGroup(this.user.group_id)
            .subscribe((response: any) => {
                response.forEach(element => {

                    const timeTables = <TimeTable>{};
                    timeTables.end_date = element.end_date;
                    timeTables.end_time = element.end_time;
                    timeTables.start_date = element.start_date;
                    timeTables.start_time = element.start_time;
                    timeTables.subject = <Subject[]>[];

                    this.studentService.getRecordsSubject(element.subject_id)
                        .subscribe((responses: any) => {
                            const subject = <Subject>{};
                            subject.tests = <TestInterface[]>[];
                            subject.subject_name = responses.pop().subject_name;


                            this.studentService.getTestsBySubject(element.subject_id)
                                .subscribe((data: any) => {
                                    data.forEach(testResponse => {
                                        const test = <TestInterface>{};
                                        test.test_name = testResponse.test_name;
                                        test.test_id = testResponse.test_id;
                                        test.tasks = testResponse.tasks;
                                        test.time_for_test = testResponse.time_for_test;
                                        test.enabled = testResponse.enabled;
                                        test.attempts = testResponse.attempts;
                                        subject.tests.push(test);
                                    });
                                    subject.ready = true;
                                });

                            timeTables.subject.push(subject);
                            this.subjects.push(timeTables);
                        });
                });
                console.log(this.subjects);
            });
    }

    startTest(studentId, testId): void {
        this.testPlayerService.startTest(studentId, testId).subscribe(
            () => {
                this.router.navigate(['test/' + testId]);
            },
            error => console.log(error)
        );
    }
}
