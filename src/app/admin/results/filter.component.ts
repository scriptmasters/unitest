import {Component, OnInit, ViewChild} from '@angular/core';
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
export class FilterComponent implements OnInit {

  filterForm: FormGroup;
  testId: number;
  groupId: number;
  groups = [];
  tests = [];
  orderTypes = [{id: 'date', name: 'по даті'},
                {id: 'rate', name: 'по рейтингу'},
                {id: 'userName', name: 'по імені'}];
  showFilter = true;

  config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1,
  };

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
    });

    this.resultService.getGroups().subscribe((groupData: any[]) => {
      this.groups = (groupData['response'] === 'no records') ? [] : groupData;
    });
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
        testId: ['', [Validators.required,
                      Validators.minLength(1),
                      Validators.pattern('([0-9\.])+')]],
        groupId: ['', [Validators.required,
                       Validators.minLength(1),
                       Validators.pattern('([0-9\.])+')]],
        order: ''
      }, {updateOn: 'blur'});
  }
}
