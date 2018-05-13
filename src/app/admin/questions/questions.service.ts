import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IQuestionSet, IQuestionGet, IAnswerSet, IAnswersGet} from './questions-interface';
import { ISubjectsGet, ITestsGet, ITestNameByID } from './questions-interface';


import { IResponse } from './questions-interface';

@Injectable()
export class QuestionsService {


  private getQuestionsByTestIdBaseURL = 'question/getRecordsRangeByTest';
  private getQuestionsNumberByTestURL = 'question/countRecordsByTest';
  private addQuestionURL = 'question/insertData';
  private addAnswerURL = 'answer/insertData';
  private getAnswersByQuestionIdURL = 'answer/getAnswersByQuestion';
  private getQuestionURL = 'question/getRecords';
  private getAllQuestionsURL = 'question/getRecords/0';
  private getAllTestsURL = 'test/getRecords';
  private getAllSubjectsURL = 'subject/getRecords';
  private getEntityValueURL = 'EntityManager/getEntityValues';
  private editQuestionURL = 'question/update';
  private editAnswerURL = 'answer/update';
  private deleteQuestionURL = 'question/del/';
  private deleteAnswerURL = 'answer/del/';



constructor(private http: HttpClient) { }


  getAllQuestions(): Observable<IQuestionGet[]> {
    return this.http.get<IQuestionGet[]>(this.getAllQuestionsURL);
  }
  getAllSubjects(): Observable<ISubjectsGet[]> {
    return this.http.get<ISubjectsGet[]>(this.getAllSubjectsURL);
  }
  getAllTests(): Observable<ITestsGet[]> {
    return this.http.get<ITestsGet[]>(this.getAllTestsURL);
  }

  getQuestionById(id: number) {
    return this.http.get(this.getQuestionURL + '/' + id);
  }

//   GET/ http://<host>/question/countRecordsByTest/<test_id>
// -- returns JSON in following format {"numberOfRecords": "10"} using for pagination

  getQuestionsNumberByTest(test_id: string) {
    return this.http.get(this.getQuestionsNumberByTestURL + '/' + test_id);
  }

  getQuestionsByTestId(test_id: string, limit: string, offset: number): Observable<IQuestionGet[]> {
    return this.http.get<IQuestionGet[]>(this.getQuestionsByTestIdBaseURL + '/' + test_id + '/' + limit + '/' + offset);
  }


  getAnswersByQuestionId(question_id: string): Observable<IAnswersGet[]> {
    return this.http.get<IAnswersGet[]>(this.getAnswersByQuestionIdURL + '/' + question_id);
      }


 // getQuestionsByTestId(test_id: string, limit: number, offset: number): Observable<IQuestionGet[]> {
  //   return this.http.get<IQuestionGet[]>(this.getQuestionsByTestIdBaseURL + '/' + test_id + '/' + limit + '/' + offset);
  //     }


  addQuestion(body): Observable<IQuestionGet|IResponse> {
    return this.http.post<IQuestionGet|IResponse>(this.addQuestionURL, body);
  }

  addAnswer(body): Observable<IAnswerSet|IResponse> {
    return this.http.post<IAnswerSet|IResponse>(this.addAnswerURL, body);
  }


//  addQuestion(title: string, description: string) {
//    const body = {subject_name: title, subject_description: description};
//    return this.http.post(this.addQuestionsURL, body);
//  }

  // editQuestion(id: number, title: string, description: string) {
  //   const body = {question_name: title, question_description: description};
  //   return this.http.post(this.editQuestionURL + '/' + id, body);
  // }

  editQuestion(id, body): Observable<IQuestionGet|IResponse> {
    return this.http.post<IQuestionGet|IResponse>(this.editQuestionURL + '/' + id, body);
  }

  editAnswer(id, body): Observable<IAnswersGet|IResponse> {
    return this.http.post<IAnswersGet|IResponse>(this.editAnswerURL + '/' + id, body);
  }

  getEntityValue(body): Observable<ITestNameByID[]> {
    return this.http.post<ITestNameByID[]>(this.getEntityValueURL, body);
  }

  deleteQuestion(id): Observable<IResponse> {
    // return this.http.delete<IResponse>(`deleteQuestionURL${id}`);
   return this.http.delete<IResponse>(this.deleteQuestionURL + id);
  }

  deleteAnswer(id): Observable<IResponse> {
   return this.http.delete<IResponse>(this.deleteAnswerURL + id);
  }

}
