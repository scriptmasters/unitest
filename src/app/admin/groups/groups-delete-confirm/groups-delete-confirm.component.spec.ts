import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsDeleteConfirmComponent } from './groups-delete-confirm.component';

describe('GroupsDeleteConfirmComponent', () => {
  let component: GroupsDeleteConfirmComponent;
  let fixture: ComponentFixture<GroupsDeleteConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsDeleteConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
