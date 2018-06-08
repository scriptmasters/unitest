import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DataService {
  constructor(public translate: TranslateService) {}

  getMark(): number {
    return +sessionStorage.getItem('mark');
  }

  setMark(m: number) {
    sessionStorage.setItem('mark', m.toString());
  }

  getAnswers(): number {
    return +sessionStorage.getItem('trueAnswers');
  }

  setAnswers(a: number) {
    sessionStorage.setItem('trueAnswers', a.toString());
  }

  setCountOfQuestions(n: number) {
    sessionStorage.setItem('numberOfQuestions', n.toString());
  }

  getCountOfQuestions(): number {
    return +sessionStorage.getItem('numberOfQuestions');
  }

  setLang(lang: string) {
    sessionStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  getLang(): string {
    const language = sessionStorage.getItem('lang');
    return language;
  }
}
