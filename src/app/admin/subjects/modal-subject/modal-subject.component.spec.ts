import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalSubjectComponent} from './modal-subject.component';

describe('ModalSubjectComponent', () => {
    let component: ModalSubjectComponent;
    let fixture: ComponentFixture<ModalSubjectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalSubjectComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalSubjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
