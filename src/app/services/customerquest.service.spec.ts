import { TestBed } from '@angular/core/testing';

import { CustomerquestService } from './customerquest.service';

describe('CustomerquestService', () => {
  let service: CustomerquestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerquestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
