import { TestBed } from '@angular/core/testing';

import { BaseService } from './base.service';

describe('BaseServiceService', () => {
  let service: BaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
