import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IQuestionsGet } from './questions-interface';
import { IQuestionAdd } from './questions-interface';
import { ITestNameByID } from './questions-interface';

import { IResponse } from './questions-interface';

@Injectable()
export class QuestionsService {


  private getQuestionURL = 'http://vps9615.hyperhost.name:443/api/question/getRecords';
  private getAllQuestionsURL = 'http://vps9615.hyperhost.name:443/api/question/getRecords/0';
  private addQuestionsURL = 'http://vps9615.hyperhost.name:443/api/question/insertData';
  private getEntityValueURL = 'http://vps9615.hyperhost.name:443/api/EntityManager/getEntityValues';
  private editQuestionURL = 'http://vps9615.hyperhost.name:443/api/question/update';

constructor(private http: HttpClient) { }


getAllQuestions(): Observable<IQuestionsGet[]> {
    return this.http.get<IQuestionsGet[]>(this.getAllQuestionsURL);
  }

getQuestionById(id: number) {
    return this.http.get(this.getQuestionURL + '/' + id);
  }



//   interface QuestionsAdd {
//    question_id: string;
//    test_id: string;
//    question_text: string;
//    level: string;
//    type: string;
//    attachment: string;}

addQuestion(body): Observable<IQuestionAdd|IResponse> {
  return this.http.post<IQuestionAdd|IResponse>(this.addQuestionsURL, body);
  }


//  addQuestion(title: string, description: string) {
//    const body = {subject_name: title, subject_description: description};
//    return this.http.post(this.addQuestionsURL, body);
//  }

  editQuestion(id: number, title: string, description: string) {
    const body = {question_name: title, question_description: description};
    return this.http.post(this.editQuestionURL + '/' + id, body);
  }



  getEntityValue(body): Observable<ITestNameByID[]> {
    return this.http.post<ITestNameByID[]>(this.getEntityValueURL, body);
  }

// Видалення завдання

  deleteQuestion(id): Observable<IResponse> {
     alert('id видаленого завданя: ' + id);

    return this.http.delete<IResponse>(`http://vps9615.hyperhost.name:443/api/question/del/${id}`);
//    return this.http.delete<IResponse>('http://vps9615.hyperhost.name:443/api/question/del/'+id);

  }

}
