import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../../auth/auth.service';
import { ChartReadyEvent } from 'ng2-google-charts';
import { ChartErrorEvent } from 'ng2-google-charts';
import { ChartSelectEvent } from 'ng2-google-charts';
import { ChartMouseOverEvent, ChartMouseOutEvent } from 'ng2-google-charts';
@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss']
})
export class QuizResultComponent implements OnInit {
  mark;
  public pieChartData;
  drawChart() {
    this.pieChartData =  {
      chartType: 'PieChart',
      dataTable: [
        ['Відповіді', 'Кількість'],
        ['Правильні відповіді', this.data.getAnswers()],
        ['Неправильні відповіді', this.data.getCountOfQuestions() - this.data.getAnswers()]
      ],
      options: {
        title: 'Відповіді',
        slices: {
          0: {
          offset: 0.05
        },
        1: {
        offset: 0.0
        }
        }
      }
    };
  }

  constructor(private data: DataService, public authService: AuthService) { }
  ngOnInit() {
    this.mark = this.data.getMark();
    this.drawChart();
  }

}
