import { Component, OnInit, Input } from '@angular/core';
import { QuestionsService } from './questions.service';
import {AddQuestionComponent} from './add-question/add-question.component';
import {EditQuestionComponent} from './edit-question/edit-question.component';

import { IQuestionGet } from './questions-interface';
import { IQuestionSet } from './questions-interface';
import { IQuestions } from './questions-interface';
import { group } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material';
import { IResponse } from './questions-interface';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DeleteConfirmComponent } from '../../shared/delete-confirm/delete-confirm.component';
import { ResponseMessageComponent } from '../../shared/response-message/response-message.component';
import { PaginationInstance } from 'ngx-pagination';
import { forEach } from '@angular/router/src/utils/collection';


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

      selectedTestId: string;
      selectedTestName: string;
      questions: IQuestionGet[] = [];
      question: IQuestions;
      subjectIdNamesArr = [];
      allTestIdNameArr = [];
      testListBySelSubject = [];
      title_component = 'Завдання для тесту: ';
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
    // console.log('from ngOnInit: this.subjectId = ', this.subjectId, ', this.testId = ',  this.testId);
    this.createSubjectsIdNamesArray();
    // this.createAllTestsIdNamesArray();

    this.createTestListBySubjectId();
     // this.createTestListBySelSubjectOrSubjectId();
     /* when tab "Завдання" is clicked this method returns an error
     ERROR TypeError: Cannot read property 'subject_id' of undefined
     although operations in it are almost the same as in the previous one
      */

    if (this.testId) {
        this.createQuestionsTableByTestId(this.testId);
    }

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
          // alert(' Вибраний тест ще не має завдань. Додайте завдання.');
           this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: `Вибраний тест ще не має завдань.
                                  Додайте завдання.`
              }
            });
        }
        // console.log('createQuestionsTableByTestId = ', this.questions);
      });

    });


  }



  createQuestionsTableBySelTestIndex(selTestIndex, limit = 1000, offset = 0) {
    this.testId = this.testListBySelSubject[selTestIndex - 1].test_id;
    this.testName = this.testListBySelSubject[selTestIndex - 1].test_name;
    console.log('this.testId  = ', this.testId, ' this.testName  = ', this.testName);

    this.service.getQuestionsNumberByTest(this.testId).subscribe(respond => {
      console.log('questionsNumberByTest = ', respond['numberOfRecords']); // returns JSON in format {"numberOfRecords": "10"}
      const questionsNumberByTest = respond['numberOfRecords'];

      this.service.getQuestionsByTestId(this.testId, questionsNumberByTest, this.offset).subscribe(data => {
        if ( data.length ) {
          this.questions = data;
        } else {
          this.questions = [];
          // alert(' Вибраний тест ще не має завдань. Додайте завдання.');
           this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: {
                message: `Вибраний тест ще не має завдань.
                                  Додайте завдання.`
              }
            });
        }
        console.log('createQuestionsTableBySelTestIndex = ', this.questions);
      });

    });

  }



  openModalAdd(selTestIndex, selTestName) {
    // - 1  becouse dropped list has additional filds 'виберіть тест'
    this.testId = this.testListBySelSubject[selTestIndex - 1].test_id;
    this.testName = selTestName;
  // console.log('this.testId = ', this.testId, ', this.testName = ', this.testName);

    const matDialogRef = this.dialog.open(AddQuestionComponent, {
      height: '600px',
      width: '900px',
      disableClose: true,
      data: {sel_TestId: this.testId, sel_TestName: this.testName}
    });
    matDialogRef.afterClosed().subscribe( () => this.createQuestionsTableByTestId(this.testId) );
  }

    openModalEdit(selQuestion) {
      const matDialogRef = this.dialog.open(EditQuestionComponent, {
        height: '600px',
        width: '900px',
        disableClose: true,
        data: {sel_quest: selQuestion, sel_TestName: this.testName}
      });
      matDialogRef.afterClosed().subscribe( () => this.createQuestionsTableByTestId(selQuestion.test_id) );
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
      // console.log('from createSubjectsIdNamesArray: this.subjectName  = ', this.subjectName );
   });
  }


  createAllTestsIdNamesArray() {
    this.service.getAllTests().subscribe(data => {
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
      //  console.log('from createAllTestsIdNamesArray:  this.testName = ', this.testName);
    });
 }


 createTestListBySubjectId() {
   this.testListBySelSubject = [];
   this.questions = [];

   this.service.getAllTests().subscribe(data => {


// ++++++++ added from createAllTestsIdNamesArray()  +++++++++
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



    // console.log('from createTestListBySubjectId: data = ', data);
     data.forEach(element => {
       if (element.subject_id === this.subjectId) {
     // console.log('from createTestListBySubjectId: element.subject_id = ', element.subject_id);
       this.testListBySelSubject.push(element);
       }
       if (element.test_id === this.testId) {
         this.testName = element.test_name;
       }
     });

     if (this.testListBySelSubject.length === 0) {
       this.testListBySelSubject.push({test_name: 'Виберіть спочатку предмет'});
     }
    //  console.log('from createTestListBySubjectId:  this.testName = ', this.testName);
  });
 }


 createTestListBySelSubjectOrSubjectId(selSubjectIndex?) {
   // console.log(`this.subjectIdNamesArr[${selSubjectIndex - 1}].subject_name = `,
   //  this.subjectIdNamesArr[selSubjectIndex - 1].subject_name);

   this.testListBySelSubject = [];
   this.questions = [];

   this.service.getAllTests().subscribe(data => {
    //  console.log('from createTestListBySelSubjectOrSubjectId: data = ', data);

     data.forEach(element => {
    //  console.log('from createTestListBySelSubjectOrSubjectId: element.subject_id = ', element.subject_id);

       if ( element.subject_id === this.subjectIdNamesArr[selSubjectIndex - 1].subject_id
       || element.subject_id === this.subjectId  ) {
       this.testListBySelSubject.push(element);
       }

       // if (element.subject_id === this.subjectId) {
       //   this.testListBySelSubject.push(element);
       //   }

       if (element.test_id === this.testId) {
         this.testName = element.test_name;
       }
     });

     if (this.testListBySelSubject.length === 0) {

    //  console.log('from createTestListBySelSubjectOrSubjectId:  this.subjectId = ', this.subjectId);

       if (!this.subjectId) {
         this.testListBySelSubject.push({test_name: 'Виберіть спочатку предмет'});
       }

       if (this.subjectId) {
         this.testListBySelSubject.push({test_name: 'Предмет немає тестів'});

       this.dialog.open(ResponseMessageComponent, {
       width: '400px',
       data: {
         message: `Вибраний предмет ще немає тестів.
                       Додайте тест.`
       }
     });
       }
     }
    //  console.log('from createTestListBySelSubjectOrSubjectId:  this.testName = ', this.testName);
  });

      //  console.log('from createTestListBySelSubject:  this.testName = ', this.testName);
      //  console.log('from createTestListBySelSubject:  this.testListBySelSubject = ', this.testListBySelSubject);
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

    this.dialog.open(ResponseMessageComponent, {
      width: '400px',
      data: {
        message: `Вибраний предмет ще немає тестів.
                      Додайте тест.`
      }
    });

  }
      // console.log('from createTestListBySelSubject:  this.testName = ', this.testName);
      console.log('from createTestListBySelSubject:  this.testListBySelSubject = ', this.testListBySelSubject);
}


// запрограмувати видалення спочатку всіх відповідей
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
                // this.dialog.open(ResponseMessageComponent, {
                //   width: '400px',
                //   data: { message: 'Відповідь з бази даних видалено!' }
                // });
              }},
              () => { // this function shows window when deleteAnswer(answer_id).subscribe returns error
                this.dialog.open(ResponseMessageComponent, {
                  width: '400px',
                  data: { message: 'Виникла помилка при видаленні цієї відповіді з бази даних!' }
                });
            });
          });
        } else {
            // this.dialog.open(ResponseMessageComponent, {
            //   width: '400px',
            //   data: { message: 'Видалене завдання не мало відповідей.' }
            // });
        }


      // after all answers were deleted we delete question

            this.service.deleteQuestion(question_id).subscribe( (data: IResponse) => {
              console.log('from handleDelete:  data = ', data);
              console.log('from handleDelete:  data.response = ', data.response);
              if (data.response === 'ok') {
                this.dialog.open(ResponseMessageComponent, {
                  width: '400px',
                  data: { message: 'Завдання було успішно видалено!' }
                });
                this.createQuestionsTableByTestId(this.testId);
              }},
              () => { // ця функція показує вікно коли deleteQuestion(question_id).subscribe повертає помилку
                this.dialog.open(ResponseMessageComponent, {
                  width: '400px',
                  data: { message: 'Виникла помилка при видаленні цього завдання!' }
                });
              });



      });



  }

  });
}


}
