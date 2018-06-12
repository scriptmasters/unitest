import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuestionsService} from './questions.service';
import {AddQuestionComponent} from './add-question/add-question.component';
import {EditQuestionComponent} from './edit-question/edit-question.component';
import {IQuestion, IResponse} from './questions-interface';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatPaginatorIntl, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {Pagination} from '../../shared/pagination/pagination.class';
import {HttpClient} from '@angular/common/http';
import {PaginationService} from '../../shared/pagination/pagination.service';


@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss'],
    providers: [QuestionsService]
})

export class QuestionsComponent extends Pagination implements OnInit, OnDestroy {

    offset = 0;
    questions: IQuestion[] = [];
    subjectIdNamesArr = [];
    allTestIdNameArr = [];
    testListBySelSubject = [];
    form: FormGroup;
    startPage: boolean;
    subjectName: string;
    testName: string;

    // these params passed from  test.component
    subjectId: string;
    testId: string;

    constructor(private service: QuestionsService,
                private activatedRoute: ActivatedRoute,
                public router: Router,
                public route: ActivatedRoute,
                public pagIntl: MatPaginatorIntl,
                public http: HttpClient,
                public dialog: MatDialog,
                public pagService: PaginationService,
                public snackBar: MatSnackBar) {
        super(router, route, pagIntl, http, dialog, pagService, snackBar);
        this.activatedRoute.queryParams.subscribe(params => {
            this.subjectId = params['subjectId'];
            this.testId = params['testId'];
        });
    }


    ngOnInit() {
        this.createSubjectsIdNamesArray();
        this.createTestListBySubjectId();

        if (this.testId) {
            this.createQuestionsTableByTestId(this.testId);
            this.startPage = false;
        } else {
            this.startPage = true;
        }
        this.initLogic(true);
    }

    ngOnDestroy() {
        this.destroyLogic();
    }


    createQuestionsTableByTestId(test_id) {
        this.testId = test_id;
        this.service.getQuestionsNumberByTest(this.testId).subscribe(respond => {
            const questionsNumberByTest = respond['numberOfRecords'];

            this.service.getQuestionsByTestId(test_id, questionsNumberByTest, this.offset).subscribe(data => {
                if (data.length) {
                    this.questions = data;
                } else {
                    this.questions = [];
                    this.openTooltip(`Вибраний тест ще не має завдань.
                    Додайте завдання.`);
                }
            });
        });
    }


    createQuestionsTableBySelTestIndex(selTestIndex) {
        this.startPage = false;

        if (this.testListBySelSubject[0].test_name !== 'Виберіть спочатку предмет') {
            this.testId = this.testListBySelSubject[selTestIndex - 1].test_id;
            this.testName = this.testListBySelSubject[selTestIndex - 1].test_name;
        }

        if (this.testId) {
            this.service.getQuestionsNumberByTest(this.testId).subscribe(respond => {
                const questionsNumberByTest = respond['numberOfRecords'];

                this.service.getQuestionsByTestId(this.testId, questionsNumberByTest, this.offset).subscribe(data => {
                    if (data.length) {
                        this.questions = data;
                    } else {
                        this.questions = [];
                        this.openTooltip(`Вибраний тест ще не має завдань.
                        Додайте завдання.`);
                    }
                });
            });
        }
    }


    openModalAdd(selTestIndex, selTestName) {

        if (selTestName && selTestName !== 'selectTest' && selTestName !== `Виберіть спочатку предмет`) {

            this.testId = this.testListBySelSubject[selTestIndex - 1].test_id;
            this.testName = selTestName;

            const matDialogRef = this.dialog.open(AddQuestionComponent, {
                height: '600px',
                width: '1000px',
                disableClose: true,
                data: {sel_TestId: this.testId, sel_TestName: this.testName, questions: this.questions}
            });
            matDialogRef.afterClosed().subscribe(() => this.createQuestionsTableByTestId(this.testId));

        } else {
            this.openTooltip(`Виберіть тест до якого потрібно додати завдання!`);
        }
    }


    openModalEdit(selQuestion) {
        const matDialogRef = this.dialog.open(EditQuestionComponent, {
            height: '600px',
            width: '1000px',
            disableClose: true,
            data: {sel_quest: selQuestion, sel_TestName: this.testName, questions: this.questions}
        });
        matDialogRef.afterClosed().subscribe(() => this.createQuestionsTableByTestId(selQuestion.test_id));
    }


    createSubjectsIdNamesArray() {
        this.service.getAllSubjects().subscribe(data => {
            this.subjectIdNamesArr = data.map(val => {
                return {
                    subject_id: val.subject_id,
                    subject_name: val.subject_name
                };
            });
            this.subjectIdNamesArr.forEach(element => {
                if (element.subject_id === this.subjectId) {
                    this.subjectName = element.subject_name;
                }
            });
        });
    }


    createTestListBySubjectId() {
        this.testListBySelSubject = [];
        this.questions = [];

        this.service.getAllTests().subscribe(data => {


            // createAllTestsIdNamesArray
            this.allTestIdNameArr = data.map(val => {
                return {
                    test_id: val.test_id,
                    test_name: val.test_name,
                    subject_id: val.subject_id
                };
            });
            this.allTestIdNameArr.forEach(element => {
                if (element.test_id === this.testId) {
                    this.testName = element.test_name;
                }
            });

            data.forEach(element => {
                if (element.subject_id === this.subjectId) {
                    this.testListBySelSubject.push(element);
                }
                if (element.test_id === this.testId) {
                    this.testName = element.test_name;
                }
            });

            if (this.testListBySelSubject.length === 0) {
                this.testListBySelSubject.push({test_name: 'Виберіть спочатку предмет'});
            }
        });
    }


    createTestListBySelSubject(selSubjectIndex?) {
        this.testListBySelSubject = [];
        this.questions = [];
        this.allTestIdNameArr.forEach(element => {
            if ((element.subject_id === this.subjectIdNamesArr[selSubjectIndex - 1].subject_id)) {
                this.testListBySelSubject.push(element);
            }
            if (element.test_id === this.testId) {
                this.testName = element.test_name;
            }
        });
        if (this.testListBySelSubject.length === 0) {
            this.testListBySelSubject.push({test_name: 'Предмет немає тестів'});

            this.openTooltip(`Вибраний предмет ще немає тестів.
            Додайте тест.`);
        }
    }


    handleDelete(question_id): void {
      const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        width: '400px',  data: { message: 'Ви справді бажаєте видалити завдання та відповіді?' }
      });
      dialogRef.afterClosed().subscribe((Response: boolean) => {
        if (Response) {
          this.service.getAnswersByQuestionId(question_id).subscribe(dataAnswers => {
            if ( dataAnswers.length ) {
              dataAnswers.forEach(answer => {
                this.service.deleteAnswer(answer.answer_id).subscribe((data: IResponse) => {
                  if (data.response === 'ok') {
                    this.openTooltip('Відповідь видалено з бази даних');
                  }},
                  () => {
                    this.openModalMessage(`Виникла помилка при видаленні відповіді з бази даних!`);
                });
              });
            } else {
              this.openTooltip(`Видалене завдання не мало відповідей.`);
            }
                this.service.deleteQuestion(question_id).subscribe( (data: IResponse) => {
                  if (data.response === 'ok') {
                    this.openTooltip('Завдання було успішно видалене');
                    this.pagService.paginatedLength === 1 ?
                        this.paginator.previousPage() :
                        this.pagService.pagSubscr.next(true);
                    this.createQuestionsTableByTestId(this.testId);
                  }},
                  () => { this.openModalMessage(`Виникла помилка при видаленні цього завдання!`); }
                );
          });
        }
      });
    }


    openModalMessage(msg: string, w: string = '400px'): void {
        this.dialog.open(ResponseMessageComponent, {
            width: w,
            data: {message: msg}
        });
    }


}
