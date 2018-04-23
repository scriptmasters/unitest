import {Component, OnInit} from '@angular/core';
import {QuestionsService} from './questions.service';
import {PageEvent} from '@angular/material';
import {IQuestionsTotal} from './questions-interface';
import {IQuestionsRange} from './questions-interface';
import {Router, ActivatedRoute} from '@angular/router';
import {MatPaginatorIntl} from '@angular/material';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
    providers: [QuestionsService, MatPaginatorIntl]
})

export class QuestionsComponent implements OnInit {

    length: number;
    test_id = 1;
    questionsRange: object;
    pageSize = 5;
    pageIndex = 0;
    pageEvent: PageEvent;


    constructor(private questionService: QuestionsService,
                private route: ActivatedRoute,
                private router: Router,
                private matPag: MatPaginatorIntl) {
    }


    ngOnInit() {
        this.matPag.nextPageLabel = 'Наступна сторінка';
        this.matPag.previousPageLabel = 'Попередня сторінка';
        this.matPag.itemsPerPageLabel = 'Кількість рядків';
        this.matPag.firstPageLabel = 'Перша сторінка';
        this.matPag.lastPageLabel = 'Остання сторінка';

        /*check whether test_id and page of pagination were received*/
        this.route.queryParams
            .subscribe(params => {
                params.testId ? this.test_id = params['testId'] : this.test_id = 1;
                params.page ? this.pageIndex = params.page : this.pageIndex = 0;

                this.questionService.questionQuantGet(this.test_id)
                    .subscribe((data: IQuestionsTotal) => this.length = +data.numberOfRecords);

                this.displayQuestions();
            });
    }
    /*Event from pagination controls*/
    displayQuestions(event?) {
        if (event) {
            this.questionService.questionsGet(this.test_id, event.pageIndex, event.pageSize)
                .subscribe(data => this.questionsRange = data);
            this.router.navigate(['/admin/questions'], {
                queryParams: {
                    testId: this.test_id,
                    page: event.pageIndex
                }
            });
            } else {
            this.questionService.questionsGet(this.test_id, this.pageIndex, this.pageSize)
                .subscribe((data: IQuestionsRange) => {
                    if (data.response === 'no records') {
                        console.log('no such page'); // TODO: open popup instead of console.log() when typed pageIndex is not reachable
                        this.router.navigate(['/admin/questions'], {
                            queryParams: {
                                testId: this.test_id,
                                page: 0
                            }
                        });
                    } else {
                        this.questionsRange = data;
                    }
                });
        }
    }
}
