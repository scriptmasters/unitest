import {Component, OnInit} from '@angular/core';
import {StatisticService} from './statistic.service';

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

    constructor(private Statistica: StatisticService) {}

    subjectObject: any;
    studentObject: any;
    testObject: any;
    adminObject: any;
    groupObject: any;
    questionObject: any;

    ngOnInit() {
        this.Statistica.countQuestion().subscribe(value => {
            this.questionObject = value;
        });
        this.Statistica.countSubject().subscribe(value => {
            this.subjectObject = value;
        });
        this.Statistica.countGroup().subscribe(value => {
            this.groupObject = value;
        });
        this.Statistica.countTest().subscribe(value => {
                this.testObject = value;
            }
        );
        this.Statistica.countAdmin().subscribe(value => {
                this.adminObject = value;
            }
        );
        this.Statistica.countStudent().subscribe(value => {
                this.studentObject = value;
            }
        );
    }
}
