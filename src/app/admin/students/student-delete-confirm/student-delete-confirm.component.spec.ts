import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDeleteConfirmComponent } from './student-delete-confirm.component';

describe('StudentDeleteConfirmComponent', () => {
  let component: StudentDeleteConfirmComponent;
  let fixture: ComponentFixture<StudentDeleteConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDeleteConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
