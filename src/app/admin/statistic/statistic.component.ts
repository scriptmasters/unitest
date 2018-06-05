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
  titleGroups = 'Груп';
  titleOfFacultyDiagram = 'Статистика груп по факультетах';
  titleOfSpecialityDiagram = 'Статистика груп по спеціальностях';

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
        const numberOfGroupsInFaculty = [];
        for (let i = 0; i < data.length; i++) {
          const id = data[i].faculty_id;
          this.Statistica.getGroupsByFaculty(id)
            .subscribe((numberOfGroups: any) => {
              this.groups = numberOfGroups;
              data.length ? numberOfGroupsInFaculty.push({name: data[i].faculty_name, y: numberOfGroups.length}) :
                            numberOfGroupsInFaculty.push({name: data[i].faculty_name, y: 0});

              Highcharts.chart('groupsByFaculty', {
                credits: {
                  enabled: false
                },
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie',
                  width: 320,
                  backgroundColor: '#0000',
                  polar: true,
                },
                title: {
                  text: this.titleOfFacultyDiagram
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
                  name: this.titleGroups,
                  colorByPoint: true,
                  data: numberOfGroupsInFaculty
                }]
              });
            });
        }
      });
// Group by speciality diagram
    this.Statistica.getSpecialities()
      .subscribe((data: Speciality[]) => {
        this.speciality = data;
        const numberOfGroupsInSpeciality = [];
        for (let i = 0; i < data.length; i++) {
          const id = data[i].speciality_id;
          this.Statistica.getGroupsBySpeciality(id)
            .subscribe((numberOfGroups: any) => {
              this.groups = numberOfGroups;
               data.length ? numberOfGroupsInSpeciality.push({name: data[i].speciality_name, y: numberOfGroups.length}) :
                              numberOfGroupsInSpeciality.push({name: data[i].speciality_name, y: 0});

              Highcharts.chart('groupsBySpeciality', {
                credits: {
                  enabled: false
                },
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie',
                  width: 320,
                  backgroundColor: '#0000',
                  polar: true,
                },
                title: {
                  text: this.titleOfSpecialityDiagram
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
                  name: this.titleGroups,
                  colorByPoint: true,
                  data: numberOfGroupsInSpeciality
                }]
              });
            });
        }
      });
  }
}

