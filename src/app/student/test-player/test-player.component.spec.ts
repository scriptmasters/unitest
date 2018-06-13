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
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Pipe, PipeTransform} from '@angular/core';
import {HttpLoaderFactory} from '../student.module';
import {HttpClient} from '@angular/common/http';

fdescribe('TestPlayerComponent', () => {
  let component: TestPlayerComponent;
  let fixture: ComponentFixture<TestPlayerComponent>;

  @Pipe({name: 'translate'})
  class MockPipeTranslate implements PipeTransform {
    transform(value: number): number {
      return value;
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        TestPlayerComponent,
        MockPipeTranslate
      ],
      providers: [
        TestPlayerService,
        QuestionService,
        StudentService,
        TimerService,
        AuthService,
        DataService,
        ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPlayerComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
