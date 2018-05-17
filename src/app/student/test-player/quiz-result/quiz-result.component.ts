import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss']
})
export class QuizResultComponent implements OnInit {
  mark;
  answers;
  constructor(private data: DataService, public authService: AuthService) { }
  ngOnInit() {
    this.mark = this.data.getMark();
    this.answers = this.data.getAnswers();
  }

}
