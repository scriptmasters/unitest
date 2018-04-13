import { Component, OnInit } from '@angular/core';
import { QuestionsService } from './questions.service';
import {AddQuestionComponent} from './add-question/add-question.component';
import {EditQuestionComponent} from './edit-question/edit-question.component';

import { IQuestionsGet } from './questions-interface';
import { IQuestionAdd } from './questions-interface';
import { IQuestions } from './questions-interface';
import { group } from '@angular/animations';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { IResponse } from './questions-interface';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
    providers: [ QuestionsService ]
})

export class QuestionsComponent implements OnInit {


 static selectedTestId: string;
      selectedTestName: string;

      questions: IQuestions[] = [];
      question: IQuestions;
      testNameSet = new Set();

      title_component = 'Завдання для тесту: ';


  form: FormGroup;
  constructor(
    private service: QuestionsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.fillOutQuestionsTable(event);
  }


openModalAdd(id, name, selName) {
  console.log('id = ', id, 'name = ', name);
  console.log('selName = ', selName);


    this.dialog.open(AddQuestionComponent, {
      height: '600px',
      width: '800px',
      data: {selId: id, selName: name}
    });
  }

openModalEdit(id) {
    this.dialog.open(EditQuestionComponent, {
      height: '600px',
      width: '800px',
      data: {test_id: id, name: 'test'}
    });
  }


  setSelectedTestName(selectedTestName): string {
    console.log('SETselectedTestName = ', selectedTestName);
    return selectedTestName;
  }


              fillOutQuestionsTable(selectedTestName): void {
                console.log('selectedTestName = ', selectedTestName);

                this.service.getAllQuestions().subscribe(data => {
                          const testArr = [];
                          let testIdNameArr = [];
                          for (let i = 0; i < data.length; i++) {
                                 testArr.push(data[i].test_id);
                          }

                  const body = JSON.stringify({entity: 'Test', ids: testArr});

                  this.service.getEntityValue(body).subscribe(response => {
                            testIdNameArr = response.map(val => {
                              return {
                                test_id: val.test_id,
                                test_name: val.test_name
                              };
                            });

                           for (let j = 0; j < testIdNameArr.length; j++) {
                              this.testNameSet.add(testIdNameArr[j].test_name);
                            }


                   this.questions = [];

                    for (let i = 0; i < data.length; i++) {

                     for (let j = 0; j < testIdNameArr.length; j++) {

                          if ( testIdNameArr[j].test_name === selectedTestName  &&
                            testIdNameArr[j].test_id === data[i].test_id) {
                            this.questions.push({
                              question_id: data[i].question_id,
                              test_id: data[i].test_id,
                              question_text: data[i].question_text,
                              level: data[i].level,
                              type: data[i].type,
                              attachment: data[i].attachment,
                              test: testIdNameArr[j].test_name
                            });
                            QuestionsComponent.selectedTestId = testIdNameArr[j].test_id;
                           console.log('selectedTestId = ', QuestionsComponent.selectedTestId);
                         }
                      }

                    }

                  });
                });
              }



    handleDelete(index): void {
    this.service.deleteQuestion(index).subscribe((data: IResponse) => {
      if (data.response === 'ok') {

        this.fillOutQuestionsTable(event);
      }
    });
  }

}
