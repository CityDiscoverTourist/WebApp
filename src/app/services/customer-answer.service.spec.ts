import { TestBed } from '@angular/core/testing';

import { CustomerAnswerService } from './customer-answer.service';

describe('CustomerAnswerService', () => {
  let service: CustomerAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
