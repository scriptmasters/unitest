import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultriesComponent } from './facultries.component';

describe('FacultriesComponent', () => {
  let component: FacultriesComponent;
  let fixture: ComponentFixture<FacultriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
