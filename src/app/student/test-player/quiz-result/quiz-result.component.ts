import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss'],
})
export class QuizResultComponent implements OnInit, OnDestroy {
  mark;
  pieChartData;
  drawChart() {
    this.pieChartData = {
      chartType: 'PieChart',
      dataTable: [
        ['Відповіді', 'Кількість'],
        ['Правильні відповіді', this.data.getAnswers()],
        [
          'Неправильні відповіді',
          this.data.getCountOfQuestions() - this.data.getAnswers(),
        ],
      ],
      options: {
        title: 'Відповіді',
        slices: {
          0: {
            offset: 0.05,
          },
          1: {
            offset: 0.0,
          },
        },
      },
    };
  }

  constructor(private data: DataService, public authService: AuthService, public translate: TranslateService) {
    translate.use(this.data.getLang());
  }
  ngOnInit() {
    this.mark = this.data.getMark();
    this.drawChart();
  }

  ngOnDestroy() {
    sessionStorage.removeItem('mark');
    sessionStorage.removeItem('numberOfQuestions');
    sessionStorage.removeItem('trueAnswers');
  }

  isAvilable(): boolean {
    if (this.data.getCountOfQuestions() <= 0) {
      return false;
    } else {
      return true;
    }
  }
}
