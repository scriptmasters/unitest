import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FacultiesDeleteComponent } from './faculties-delete.component';

describe('FacultiesDeleteComponent', () => {
  let component: FacultiesDeleteComponent;
  let fixture: ComponentFixture<FacultiesDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultiesDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultiesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
