import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPlayerComponent } from './test-player.component';
import {FormsModule} from '@angular/forms';
import {TestPlayerService} from '../services/test-player.service';
import {QuestionService} from '../services/question.service';
import {StudentService} from '../student.service';
import {TimerService} from '../services/timer.service';
import {RouterTestingModule} from '@angular/router/testing';
import {MatDialogModule, MatSnackBarModule} from '@angular/material';
import {AuthService} from '../../auth/auth.service';
import {DataService} from '../services/data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

fdescribe('TestPlayerComponent', () => {
  let component: TestPlayerComponent;
  let fixture: ComponentFixture<TestPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        HttpClientTestingModule
      ],
      declarations: [TestPlayerComponent],
      providers: [
        TestPlayerService,
        QuestionService,
        StudentService,
        TimerService,
        AuthService,
        DataService
        ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
