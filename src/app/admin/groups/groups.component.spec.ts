import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

import {GroupsComponent} from './groups.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DebugElement, Pipe, PipeTransform} from '@angular/core';
import {GroupsRoutingModule} from './groups-routing.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DialogComponent} from './dialog/dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatSnackBarModule} from '@angular/material';
import {MatDialogModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {PaginationService} from '../../shared/pagination/pagination.service';
import {GroupsService} from './groups.service';
import {Observable} from 'rxjs/Observable';
import {Groups, Specialities, Faculties, Table} from './interface';



import {GroupsDeleteConfirmComponent} from './groups-delete-confirm/groups-delete-confirm.component';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DeleteConfirmComponent} from '../../shared/delete-confirm/delete-confirm.component';
import {SharedModule} from '../../shared/shared.module';


fdescribe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  const groups: Groups[] = [
    {
      'group_id': '1',
      'group_name': 'СІ-12-1',
      'speciality_id': '1',
      'faculty_id': '1'
    },
    {
      'group_id': '5',
      'group_name': 'ІЕ-11-1',
      'speciality_id': '2',
      'faculty_id': '2'
    }
  ];
  const faculties: Faculties[] = [
    {
      'faculty_id': '1',
      'faculty_name': 'Інститут інформаційних технологій',
      'faculty_description': 'факультет справжніх айтішників'
    },
    {
      'faculty_id': '2',
      'faculty_name': 'Енергетичний інститут',
      'faculty_description': 'Електрики і метрологи тут вчаться'
    }
  ];
  const specialities: Specialities[] = [
    {
      'speciality_id': '1',
      'speciality_code': '6.050215',
      'speciality_name': 'Телекомунікації та радіотехніка'
    },
    {
      'speciality_id': '2',
      'speciality_code': '6.0502172',
      'speciality_name': 'Телекомунікації та радіотехніка'
    }
  ];
  const table: Table[] = [
    {
      'group_id': 1,
      'group': 'СІ-12-1',
      'faculty': 'Інститут інформаційних технологій',
      'speciality': 'Телекомунікації та радіотехніка'
    },
    {
      'group_id': 5,
      'group': 'ІЕ-11-1',
      'faculty': 'Енергетичний інститут',
      'speciality': 'Телекомунікації та радіотехніка'
    }
  ];


  class MockGroupsService {

    _getGroup(): Observable<Groups[]> {
      return Observable.of(groups);
    }

    _getFaculties(): Observable<Faculties[]> {
      return Observable.of(faculties);
    }

    _getSpecialities(): Observable<Specialities[]> {
      return Observable.of(specialities);
    }

  }


  @Pipe({name: 'pagination'})
  class MockPipePagination implements PipeTransform {
    transform(value: number): number {
      return value;
    }
  }

  @Pipe({name: 'specialityFilterPipe'})
  class MockPipeSpeciality implements PipeTransform {
    // transform(value: number): number {
    //   return value;
    // }

    transform(_table, value) {
      if (!value || value === 'Виберіть спецільність') {
        return _table;
      }
      return _table.filter(tab => {
        return tab.speciality.toLowerCase().includes(value.toLowerCase());
      });
    }
  }

  @Pipe({name: 'facultyFilterPipe'})
  class MockPipeFaculty implements PipeTransform {
    // transform(value: number): number {
    //   return value;
    // }

    transform(_table, value) {
      if (!value || value === 'Виберіть факультет') {
        return _table;
      }
      return _table.filter(tab => {
        return tab.faculty.toLowerCase().includes(value.toLowerCase());
      });
    }
  }

  @Pipe({name: 'search'})
  class MockPipeSearch implements PipeTransform {
    // transform(value: number): number {
    //   return value;
    // }

    transform(_table, value) {
      if (!value) {
        return _table;
      }
      return _table.filter(tab => {
        return tab.group.toLowerCase().includes(value.toLowerCase());
      });
    }
  }

  beforeEach(async(() => {

    // mockGroupsService = new MockGroupsService();

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatProgressBarModule,
        GroupsRoutingModule,
        MatPaginatorModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatDialogModule,
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [
        GroupsComponent,
        MockPipePagination,
        MockPipeSearch,
        MockPipeFaculty,
        MockPipeSpeciality,
        DialogComponent,
        GroupsDeleteConfirmComponent
      ],
      providers: [
        {provide: GroupsService, useClass: MockGroupsService},
        PaginationService,
        DeleteConfirmComponent
      ],
    })
      .overrideComponent(GroupsComponent, {
        set: {
          providers: [
            {provide: GroupsService, useClass: MockGroupsService},
            PaginationService,
            DeleteConfirmComponent
          ],
          entryComponents: [
            DeleteConfirmComponent
          ]
        }
      })
      .compileComponents();



  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // groupsService = TestBed.get(GroupsService);
  });

  it(`should create`, () => {
    expect(component).toBeTruthy();
  });

  it(`should groups contain groups objects`, () => {
    component.ngOnInit();
    expect(component.groups).toEqual(groups);
  });

  it(`should faculties contain faculties objects`, () => {
    component.ngOnInit();
    expect(component.faculties).toEqual(faculties);
  });

  it(`should Specialities contain Specialities objects`, () => {
    component.ngOnInit();
    expect(component.specialities).toEqual(specialities);
  });

  it(`should table contain groups, faculties and specialities data`, () => {
    component.ngOnInit();
    expect(component.table).toEqual(table);
  });

  it(`should table output only row with group 'СІ-12-1' after input 'СІ' in field search `, () => {
    const hostElement = fixture.debugElement;
    const searchInputD: DebugElement = hostElement.query(By.css('#searchInp'));
    const tableBodyD: DebugElement = hostElement.query(By.css('tbody'));
    const searchInput: HTMLInputElement = searchInputD.nativeElement;
    const tableBody: HTMLElement = tableBodyD.nativeElement;

    // simulate user entering a new name into the input box
    searchInput.value = 'СІ';

    // dispatch a DOM event so that Angular learns of input value change.
    searchInput.dispatchEvent(new Event('input'));

    // Tell Angular to update the display binding through the title pipe
    fixture.detectChanges();

    expect(tableBody.innerText).toContain('1	СІ-12-1	Інститут інформаційних технологій	Телекомунікації та радіотехніка');
  });

  it(`should sort groups ASC`, () => {
    const sortedTable: Table[] = [
      {
        'group_id': 5,
        'group': 'ІЕ-11-1',
        'faculty': 'Енергетичний інститут',
        'speciality': 'Телекомунікації та радіотехніка'
      },
      {
        'group_id': 1,
        'group': 'СІ-12-1',
        'faculty': 'Інститут інформаційних технологій',
        'speciality': 'Телекомунікації та радіотехніка'
      }
    ];

    component.sortBy = 'asc';
    component.sorting('group');
    expect(component.table).toEqual(sortedTable);
  });

  it(`should sort faculty DESC`, () => {
    const sortedTable: Table[] = [
      {
        'group_id': 1,
        'group': 'СІ-12-1',
        'faculty': 'Інститут інформаційних технологій',
        'speciality': 'Телекомунікації та радіотехніка'
      },
      {
        'group_id': 5,
        'group': 'ІЕ-11-1',
        'faculty': 'Енергетичний інститут',
        'speciality': 'Телекомунікації та радіотехніка'
      }
    ];

    component.sortBy = 'desc';
    component.sorting('faculty');
    expect(component.table).toEqual(sortedTable);
  });
});

