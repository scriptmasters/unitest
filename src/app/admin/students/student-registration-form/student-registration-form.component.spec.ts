import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRegistrationFormComponent } from './student-registration-form.component';

describe('StudentRegistrationFormComponent', () => {
  let component: StudentRegistrationFormComponent;
  let fixture: ComponentFixture<StudentRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentRegistrationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
