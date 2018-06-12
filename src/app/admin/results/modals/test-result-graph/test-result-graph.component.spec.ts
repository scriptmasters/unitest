import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultGraphComponent } from './test-result-graph.component';

describe('TestResultGraphComponent', () => {
  let component: TestResultGraphComponent;
  let fixture: ComponentFixture<TestResultGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestResultGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
