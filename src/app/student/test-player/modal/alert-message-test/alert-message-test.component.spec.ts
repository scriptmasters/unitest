import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMessageTestComponent } from './alert-message-test.component';

describe('AlertMessageTestComponent', () => {
  let component: AlertMessageTestComponent;
  let fixture: ComponentFixture<AlertMessageTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertMessageTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMessageTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
