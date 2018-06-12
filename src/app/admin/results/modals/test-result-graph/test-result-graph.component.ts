import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-test-result-graph',
  templateUrl: './test-result-graph.component.html',
  styleUrls: ['./test-result-graph.component.scss']
})
export class TestResultGraphComponent implements OnInit {

  showNoDataMessage = false;
  private resultList = [];
  rating;
  success;
  constructor(public dialogRef: MatDialogRef<TestResultGraphComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any[], private translate: TranslateService) {
                translate.get('STUD.SUCC').subscribe(msg => {
                  this.success = msg;
                });
                translate.get('ADMIN.RES.RATING').subscribe(ms => {
                  this.rating = ms;
                });
              }

  ngOnInit() {
    this.drawChart();
  }

  private drawChart() {
    if (!this.data || this.data.length === 0) {
      this.showNoDataMessage = true;
      return;
    }
    this.resultList = JSON.parse(JSON.stringify(this.data));
    this.resultList.forEach(x => {
      x['quality'] = Number(x['quality'].toString().replace('%', ''));
    });

    const highCharts = require('highcharts');
    highCharts.chart('test-statistic-graph', {
      chart: {
        type: 'column'
      },
      title: {
        text: this.success
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: this.rating
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.1f}%'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
      },

      'series': [
        {
          'name': ' ',
          'colorByPoint': true,
          'data': this.getDataForChart()
        }
      ]
    });
  }

  private getDataForChart(): any[] {
    const graphData = [];
    const userNames = new Set();
    this.resultList.forEach(x => {
      userNames.add(x.student_name);
    });

    userNames.forEach(userName => {
      const testResultRecordsByStudent = this.resultList.filter(x => x.student_name === userName);
      const maxQuality = Math.max(...testResultRecordsByStudent.map(x => x['quality']));
      const item = {
        name : userName,
        y : maxQuality
      };
      graphData.push(item);
    });

    return graphData;
  }
}
