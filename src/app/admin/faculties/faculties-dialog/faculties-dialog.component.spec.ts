import { FacultiesDialogComponent } from './faculties-dialog.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';


describe('FacultiesUpdateComponent', () => {
  let component: FacultiesDialogComponent;
  let fixture: ComponentFixture<FacultiesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultiesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
