import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {IAnswer, IAnswerSet, IQuestion, IResponse, ISubjectsGet, ITestsGet} from './questions-interface';

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
  private editQuestionURL = 'question/update';
  private editAnswerURL = 'answer/update';
  private deleteQuestionURL = 'question/del/';
  private deleteAnswerURL = 'answer/del/';



constructor(private http: HttpClient) { }


  getAllQuestions(): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>(this.getAllQuestionsURL);
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

  getQuestionsNumberByTest(test_id: string) {
    return this.http.get(this.getQuestionsNumberByTestURL + '/' + test_id);
  }

  getQuestionsByTestId(test_id: string, limit: string, offset: number): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>(this.getQuestionsByTestIdBaseURL + '/' + test_id + '/' + limit + '/' + offset);
  }


  getAnswersByQuestionId(question_id: string): Observable<IAnswer[]> {
    return this.http.get<IAnswer[]>(this.getAnswersByQuestionIdURL + '/' + question_id);
  }


  addQuestion(body): Observable<IQuestion|IResponse> {
    return this.http.post<IQuestion|IResponse>(this.addQuestionURL, body);
  }

  addAnswer(body): Observable<IAnswerSet|IResponse> {
    return this.http.post<IAnswerSet|IResponse>(this.addAnswerURL, body);
  }

  editQuestion(id, body): Observable<IQuestion|IResponse> {
    return this.http.post<IQuestion|IResponse>(this.editQuestionURL + '/' + id, body);
  }

  editAnswer(id, body): Observable<IAnswer|IResponse> {
    return this.http.post<IAnswer|IResponse>(this.editAnswerURL + '/' + id, body);
  }

  deleteQuestion(id): Observable<IResponse> {
   return this.http.delete<IResponse>(this.deleteQuestionURL + id);
  }

  deleteAnswer(id): Observable<IResponse> {
   return this.http.delete<IResponse>(this.deleteAnswerURL + id);
  }

}
