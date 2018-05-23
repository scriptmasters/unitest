import { Component, OnInit } from '@angular/core';
import { StatisticService } from './statistic.service';
import { FacultiesService } from '../faculties/services/faculties.service';
import { Faculties } from '../faculties/facultiesInterface';
import { Speciality } from '../specialities/specialityInterface';

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  constructor(private Statistica: StatisticService, public facultiesService: FacultiesService) {
  }

  subjectObject: any;
  studentObject: any;
  testObject: any;
  adminObject: any;
  groupObject: any;
  questionObject: any;
  faculties: Faculties[] = [];
  speciality: Speciality[] = [];
  groups: any;

  ngOnInit() {
    this.Statistica.countQuestion().subscribe(value => {
      this.questionObject = value;
    });
    this.Statistica.countSubject().subscribe(value => {
      this.subjectObject = value;
    });
    this.Statistica.countGroup().subscribe(value => {
      this.groupObject = value;
    });
    this.Statistica.countTest().subscribe(value => {
        this.testObject = value;
      }
    );
    this.Statistica.countAdmin().subscribe(value => {
        this.adminObject = value;
      }
    );
    this.Statistica.countStudent().subscribe(value => {
        this.studentObject = value;
      }
    );
    this.drawChart();
  }
// Create chart
  drawChart() {
    const Highcharts = require('highcharts');
// Group by faculty diagram
    this.facultiesService.getFaculties()
      .subscribe((data: Faculties[]) => {
        this.faculties = data;
        const arr = {name: '', y: ''};
        const arr1 = [];
        for (let i = 0; i < data.length; i++) {
          const id = data[i].faculty_id;
          this.Statistica.getGroupsByFaculty(id)
            .subscribe((data1: any) => {
              this.groups = data1;
              arr.name = data[i].faculty_name;
              arr.y = data1.length;
              arr1.push({name: arr.name, y: arr.y});

              Highcharts.chart('container', {
                credits: {
                  enabled: false
                },
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie',
                  width: 700,
                  backgroundColor: '#0000',
                  polar: true,
                },
                title: {
                  text: 'Статистика груп по факультетах'
                },
                tooltip: {
                  pointFormat: '{series.name}: <b>{point.y}</b>'
                },
                plotOptions: {
                  pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>',
                      style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                      }
                    }
                  }
                },
                series: [{
                  name: 'Груп',
                  colorByPoint: true,
                  data: arr1
                }]
              });
            });
        }
      });
// Group by speciality diagram
    this.Statistica.getSpecialities()
      .subscribe((data: Speciality[]) => {
        this.speciality = data;
        const arr = {name: '', y: ''};
        const arr1 = [];
        for (let i = 0; i < data.length; i++) {
          const id = data[i].speciality_id;
          this.Statistica.getGroupsBySpeciality(id)
            .subscribe((data1: any) => {
              this.groups = data1;
              arr.name = data[i].speciality_name;
              arr.y = data1.length;
              arr1.push({name: data[i].speciality_name, y: data1.length});

              Highcharts.chart('container1', {
                credits: {
                  enabled: false
                },
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie',
                  width: 550,
                  backgroundColor: '#0000',
                  polar: true,
                },
                title: {
                  text: 'Статистика груп по спеціальностях'
                },
                tooltip: {
                  pointFormat: '{series.name}: <b>{point.y}</b>'
                },
                plotOptions: {
                  pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>',
                      style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                      }
                    }
                  }
                },
                series: [{
                  name: 'Груп',
                  colorByPoint: true,
                  data: arr1
                }]
              });
            });
        }
      });
  }
}

