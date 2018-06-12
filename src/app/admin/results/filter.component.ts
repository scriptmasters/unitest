import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResultsService} from './services/results.service';
import {PaginationInstance} from 'ngx-pagination';
import {ResultComponent} from './result/result.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-results',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  filterForm: FormGroup;
  testId: number;
  groupId: number;
  groups = [];
  tests = [];
  testsForSelection = [];
  showFilter = true;

  config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1,
  };
  private groupChange$: any;

  @ViewChild(ResultComponent) resultComponent;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private resultService: ResultsService
  ) {
  }

  ngOnInit() {
    this.initForm();

    this.route.queryParams.subscribe(params => {
      const groupIdParam = params['groupId'];
      if (groupIdParam) {
        this.groupId = groupIdParam;
        this.filterForm.controls['groupId'].setValue(this.groupId);
      }
    });

    this.resultService.getTests().subscribe((testData: any[]) => {
      this.tests = (testData['response'] === 'no records') ? [] : testData;
      this.testsForSelection = this.tests;
      if (this.groupId) {
        this.resultService.getResultTestIdsByGroup(this.groupId).subscribe(response => {
          this.mergeTestForSelection(response);
        });
      }
    });

    this.resultService.getGroups().subscribe((groupData: any[]) => {
      this.groups = (groupData['response'] === 'no records') ? [] : groupData;
      this.groups.sort((a, b) => a.group_name.localeCompare(b.group_name));
    });
  }

  ngOnDestroy() {
    this.groupChange$.unsubscribe();
  }

  search() {
    if (this.filterForm.valid) {
      this.showFilter = false;
      this.resultComponent.search();
    }
  }

  toggleFilter(event: boolean) {
    this.showFilter = event;
  }

  private initForm() {
    this.filterForm = this.formBuilder.group({
      testId: [{value: '', disabled: true}, [Validators.required,
                    Validators.minLength(1),
                    Validators.pattern('([0-9\.])+')]],
      groupId: ['', [Validators.required,
                     Validators.minLength(1),
                     Validators.pattern('([0-9\.])+')]]
    }, {updateOn: 'blur'});
    this.groupChange$ = this.filterForm.get('groupId').valueChanges.subscribe( e => {
      if (e) {
        this.filterForm.get('testId').enable();
        this.resultService.getResultTestIdsByGroup(e).subscribe(response => {
          this.mergeTestForSelection(response);
        });
      } else {
        this.filterForm.get('testId').setValue(null);
        this.filterForm.get('testId').disable();
      }
    });
  }

  private mergeTestForSelection(testIds) {
    testIds = (testIds['response'] === 'no records') ? [] : testIds;
    this.testsForSelection = [];
    testIds.forEach(result => {
      const test = this.tests.find(x => x.test_id === result.test_id);
      if (test) {
        this.testsForSelection.push(test);
      }
    });
    this.testsForSelection.sort((a, b) => a.test_name.localeCompare(b.test_name));
  }
}
