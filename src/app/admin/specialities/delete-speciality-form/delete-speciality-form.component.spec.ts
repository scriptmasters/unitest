import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSpecialityFormComponent } from './delete-speciality-form.component';

describe('DeleteSpecialityFormComponent', () => {
  let component: DeleteSpecialityFormComponent;
  let fixture: ComponentFixture<DeleteSpecialityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteSpecialityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSpecialityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
