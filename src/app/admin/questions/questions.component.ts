import {Component, OnInit} from '@angular/core';
import {QuestionsService} from './questions.service';
import {MatDialog, MatPaginator, PageEvent} from '@angular/material';
import {IQuestionsTotal} from './questions-interface';
import {IQuestionsRange} from './questions-interface';
import {Router, ActivatedRoute} from '@angular/router';
import {MatPaginatorIntl} from '@angular/material';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {forkJoin} from 'rxjs/observable/forkJoin';


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
    lastPage: number;
    pageEvent: PageEvent;

    constructor(private questionService: QuestionsService,
                private route: ActivatedRoute,
                private router: Router,
                private matPagIntl: MatPaginatorIntl,
                private dialog: MatDialog
                ) {
    }

    ngOnInit() {

        this.matPagIntl.nextPageLabel = 'Наступна сторінка';
        this.matPagIntl.previousPageLabel = 'Попередня сторінка';
        this.matPagIntl.itemsPerPageLabel = 'Кількість рядків';
        this.matPagIntl.firstPageLabel = 'Перша сторінка';
        this.matPagIntl.lastPageLabel = 'Остання сторінка';

        /*check whether test_id and page of pagination were received*/
        this.route.queryParams
            .subscribe(params => {
                params.testId ? this.test_id = params['testId'] : this.test_id = 1;
                params.page ? this.pageIndex = params.page : this.pageIndex = 0;

                this.questionService.questionQuantGet(this.test_id)
                    .subscribe((data: IQuestionsTotal) => {
                        this.length = +data.numberOfRecords;
                        this.lastPage = Math.floor(this.length / this.pageSize);
                    });

                this.displayQuestions();
            });
    }

    /*Event from pagination controls*/
    displayQuestions(event?) {
        if (event) {
                this.questionService.questionsGet(this.test_id, event.pageIndex, event.pageSize)
                    .subscribe(data => this.questionsRange = data);
                this.pageIndex = event.pageIndex;
                this.pageSize = event.pageSize;
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
                        } else {this.questionsRange = data; }
                    });
                    }
    }

    /*Transfer test_id to add-question component and open it*/
    questionAdd() {
        this.router.navigate(['/admin/add-question'], {
            queryParams: {
                testId: this.test_id
            }
        });
    }

    questionDelete(id) {
        this.questionService.getAnswersByQuestion(id)
            .subscribe((data: any) => {
                if (!data.response) {
                    const requests = [];
                    for (let i = 0; i < data.length; i++) {
                        requests.push(this.questionService.answerDelete(data[i].answer_id));
                    }
                    forkJoin(...requests).subscribe(
                        () => this.questionService.questionDelete(id)
                            .subscribe(() => {
                                    this.openModalMessage('Запитання з відповідями видалене');
                                    this.displayQuestions();
                                }
                            ));
                } else { this.questionService.questionDelete(id)
                    .subscribe(() => {
                            this.openModalMessage('Запитання з відповідями видалене');
                            this.displayQuestions();
                        }
                    );
                }
            }
            );
    }

    openModalMessage(msg: string, w: string = '400px'): void {
        this.dialog.open(ResponseMessageComponent, {
            width: w,
            data: {
                message: msg
            }
        });
    }
}
