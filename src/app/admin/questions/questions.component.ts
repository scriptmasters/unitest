import {Component, OnInit} from '@angular/core';
import {QuestionsService} from './questions.service';
import {AddQuestionComponent} from './add-question/add-question.component';
import {EditQuestionComponent} from './edit-question/edit-question.component';

import {IQuestion, IResponse} from './questions-interface';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {ResponseMessageComponent} from '../../shared/response-message/response-message.component';
import {PaginationInstance} from 'ngx-pagination';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
    providers: [ QuestionsService ]
})

export class QuestionsComponent implements OnInit {

      public config: PaginationInstance = {
        itemsPerPage: 5,
        currentPage: 1
      };

      offset = 0;
      questions: IQuestion[] = [];
      // question: IQuestions;
      subjectIdNamesArr = [];
      allTestIdNameArr = [];
      testListBySelSubject = [];
      form: FormGroup;

      subjectName: string;
      testName: string;

      // these params passed from  test.component
      subjectId: string;
      testId: string;
      // openQuestions(test_id: string) {
      //   this.router.navigate(['/admin/questions'], {
      //     queryParams: {  subjectId: this.subjectId, testId: test_id, }
      //   });
      // }
      // and on questions icon click event should be hanged method (click)="openQuestions(t.test_id, t.test_name


  constructor(
    private service: QuestionsService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.subjectId = params['subjectId'];
        this.testId = params['testId'];
      });
      console.log('Called Constructor');
   }



  ngOnInit() {
    console.log('from ngOnInit: this.subjectId = ', this.subjectId, ', this.testId = ',  this.testId);
    this.createSubjectsIdNamesArray();
    this.createTestListBySubjectId();

    if (this.testId) {
        this.createQuestionsTableByTestId(this.testId);
    }

  }


  // Dialog modal message
  openModalMessage(msg: string, w: string = '400px'): void {
    this.dialog.open(ResponseMessageComponent, {
        width: w,
        data: { message: msg }
    });
  }


   createQuestionsTableByTestId(test_id) {
    this.testId = test_id;
    // this.testName = ;
    this.service.getQuestionsNumberByTest(this.testId).subscribe(respond => {
      console.log('questionsNumberByTest = ', respond['numberOfRecords']); // returns JSON in format {"numberOfRecords": "10"}
      const questionsNumberByTest = respond['numberOfRecords'];

      this.service.getQuestionsByTestId(test_id, questionsNumberByTest, this.offset).subscribe(data => {
        if ( data.length ) {
          this.questions = data;
        } else {
          this.questions = [];
            this.openModalMessage(`Вибраний тест ще не має завдань.
            Додайте завдання.`);
        }
        // console.log('createQuestionsTableByTestId = ', this.questions);
      });

    });


  }



  createQuestionsTableBySelTestIndex(selTestIndex, limit = 1000, offset = 0) {
    console.log('from createQuestionsTableBySelTestIndex: testListBySelSubject  = ', this.testListBySelSubject);

    if (this.testListBySelSubject[0].test_name !== 'Виберіть спочатку предмет') {
    // if (this.testListBySelSubject[selTestIndex - 1].test_id) {
      this.testId = this.testListBySelSubject[selTestIndex - 1].test_id;
      this.testName = this.testListBySelSubject[selTestIndex - 1].test_name;
      console.log('from createQuestionsTableBySelTestIndex: this.testId  = ', this.testId, ' this.testName  = ', this.testName);
    }

    if ( this.testId ) {
    this.service.getQuestionsNumberByTest(this.testId).subscribe(respond => {
      console.log('questionsNumberByTest = ', respond['numberOfRecords']); // returns JSON in format {"numberOfRecords": "10"}
      const questionsNumberByTest = respond['numberOfRecords'];

      this.service.getQuestionsByTestId(this.testId, questionsNumberByTest, this.offset).subscribe(data => {
        if ( data.length ) {
          this.questions = data;
        } else {
          this.questions = [];
            this.openModalMessage(`Вибраний тест ще не має завдань.
            Додайте завдання.`);
        }
        console.log('createQuestionsTableBySelTestIndex = ', this.questions);
      });

    });
  }

  }


  openModalAdd(selTestIndex, selTestName) {

  console.log('selTestIndex = ', selTestIndex, ', selTestName = ', selTestName);

     if (selTestName && selTestName !== 'selectTest' && selTestName !== `Виберіть спочатку предмет` ) {

    // - 1  becouse dropped list has additional filds 'виберіть тест'
    this.testId = this.testListBySelSubject[selTestIndex - 1].test_id;
    this.testName = selTestName;
  console.log('this.testId = ', this.testId, ', this.testName = ', this.testName);

    const matDialogRef = this.dialog.open(AddQuestionComponent, {
      height: '600px',
      width: '1000px',
      disableClose: true,
      data: {sel_TestId: this.testId, sel_TestName: this.testName}
    });
    matDialogRef.afterClosed().subscribe( () => this.createQuestionsTableByTestId(this.testId) );

    } else {
      this.openModalMessage(`Виберіть тест до якого потрібно додати завдання!`);
    }
  }


    openModalEdit(selQuestion) {
      const matDialogRef = this.dialog.open(EditQuestionComponent, {
        height: '600px',
        width: '1000px',
        disableClose: true,
        data: {sel_quest: selQuestion, sel_TestName: this.testName}
      });
      matDialogRef.afterClosed().subscribe( () => this.createQuestionsTableByTestId(selQuestion.test_id) );
    }

// for select subject filter
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
      // console.log('from createSubjectsIdNamesArray: this.subjectName  = ', this.subjectName );
   });
  }


 createTestListBySubjectId() {
   this.testListBySelSubject = [];
   this.questions = [];

   this.service.getAllTests().subscribe(data => {


// ++++++++ createAllTestsIdNamesArray()  +++++++++
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
    // console.log('from createAllTestsIdNamesArray:  this.testName = ', this.testName);
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



     data.forEach(element => {
       if (element.subject_id === this.subjectId) {
     // console.log('from createTestListBySubjectId: element.subject_id = ', element.subject_id);
       this.testListBySelSubject.push(element);
       }
       if (element.test_id === this.testId) {
         this.testName = element.test_name;
       }
     });

    //  if (condition) {

    //  }

     if (this.testListBySelSubject.length === 0) {
       this.testListBySelSubject.push({test_name: 'Виберіть спочатку предмет'});
     }
    //  console.log('from createTestListBySubjectId:  this.testName = ', this.testName);
  });
 }




 createTestListBySelSubject(selSubjectIndex?) {
  // console.log(`this.subjectIdNamesArr[${selSubjectIndex - 1}].subject_name = `,
  //  this.subjectIdNamesArr[selSubjectIndex - 1].subject_name);
  // console.log('from createTestListBySelSubject: this.allTestIdNameArr = ', this.allTestIdNameArr);

  this.testListBySelSubject = [];
  this.questions = [];
  this.allTestIdNameArr.forEach(element => {
    if ( (element.subject_id === this.subjectIdNamesArr[selSubjectIndex - 1].subject_id)
      /* || (element.subject_id === this.subjectId)  */ ) {
      this.testListBySelSubject.push(element);
    }

    if (element.test_id === this.testId) {
      this.testName = element.test_name;
    }
  } );
  if (this.testListBySelSubject.length === 0) {
    this.testListBySelSubject.push({test_name: 'Предмет немає тестів'});

    this.openModalMessage(`Вибраний предмет ще немає тестів.
    Додайте тест.`);

  }
      // console.log('from createTestListBySelSubject:  this.testName = ', this.testName);
      console.log('from createTestListBySelSubject:  this.testListBySelSubject = ', this.testListBySelSubject);
}


handleDelete(question_id): void {
  const dialogRef = this.dialog.open(DeleteConfirmComponent, {
    width: '400px',
    data: {
      message: 'Ви справді бажаєте видалити завдання та відповіді?'
    }
  });
  dialogRef.afterClosed().subscribe((Response: boolean) => {
    if (Response) {

      console.log('from handleDelete:  question_id = ', question_id);
      this.service.getAnswersByQuestionId(question_id).subscribe(dataAnswers => {
      console.log('from handleDelete:  dataAnswers = ', dataAnswers);

        if ( dataAnswers.length ) {
          dataAnswers.forEach(answer => {
            this.service.deleteAnswer(answer.answer_id).subscribe((data: IResponse) => {
              if (data.response === 'ok') {
                // this.openModalMessage(`Відповідь з бази даних видалено!`);
              }},
              () => {
                this.openModalMessage(`Виникла помилка при видаленні відповіді з бази даних!`);
            });
          });
        } else {
          this.openModalMessage(`Видалене завдання не мало відповідей.`);
        }



            this.service.deleteQuestion(question_id).subscribe( (data: IResponse) => {
              console.log('from handleDelete:  data = ', data);
              console.log('from handleDelete:  data.response = ', data.response);
              if (data.response === 'ok') {
                this.openModalMessage(`Завдання було успішно видалено!`);
                this.createQuestionsTableByTestId(this.testId);
              }},
              () => {
                this.openModalMessage(`Виникла помилка при видаленні цього завдання!`);
              });



      });



  }

  });
}


}
