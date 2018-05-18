import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimetableDeleteConfirmComponent} from './timetable-delete-confirm.component';

describe('TimetableDeleteConfirmComponent', () => {
  let component: TimetableDeleteConfirmComponent;
  let fixture: ComponentFixture<TimetableDeleteConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetableDeleteConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
