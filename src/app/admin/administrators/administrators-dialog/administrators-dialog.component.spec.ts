import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorsDialogComponent } from './administrators-dialog.component';

describe('AdministratorsDialogComponent', () => {
  let component: AdministratorsDialogComponent;
  let fixture: ComponentFixture<AdministratorsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministratorsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
