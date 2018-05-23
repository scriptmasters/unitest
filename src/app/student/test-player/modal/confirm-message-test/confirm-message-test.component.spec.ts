import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMessageTestComponent } from './confirm-message-test.component';

describe('ConfirmMessageTestComponent', () => {
  let component: ConfirmMessageTestComponent;
  let fixture: ComponentFixture<ConfirmMessageTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmMessageTestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMessageTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
