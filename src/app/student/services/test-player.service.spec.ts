import {inject, TestBed} from '@angular/core/testing';

import {TestPlayerService} from './test-player.service';

describe('TestPlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestPlayerService],
    });
  });

  it(
    'should be created',
    inject([TestPlayerService], (service: TestPlayerService) => {
      expect(service).toBeTruthy();
    })
  );
});
