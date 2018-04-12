import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  table: any;

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    console.log(id);
  }

}
