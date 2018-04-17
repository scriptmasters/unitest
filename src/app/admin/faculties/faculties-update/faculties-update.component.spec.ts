import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FacultiesUpdateComponent } from './faculties-update.component';

describe('FacultiesUpdateComponent', () => {
  let component: FacultiesUpdateComponent;
  let fixture: ComponentFixture<FacultiesUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultiesUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultiesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
