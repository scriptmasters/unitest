import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FacultiesAddComponent } from './faculties-add.component';

describe('FacultiesAddComponent', () => {
  let component: FacultiesAddComponent;
  let fixture: ComponentFixture<FacultiesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultiesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultiesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});