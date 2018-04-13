import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEditFormComponent } from './student-edit-form.component';

describe('StudentEditFormComponent', () => {
  let component: StudentEditFormComponent;
  let fixture: ComponentFixture<StudentEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
