import { TestBed, inject } from '@angular/core/testing';

import { AdministratorsService } from './administrators.service';

describe('AdministratorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdministratorsService]
    });
  });

  it('should be created', inject([AdministratorsService], (service: AdministratorsService) => {
    expect(service).toBeTruthy();
  }));
});
