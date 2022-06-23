import { TestBed } from '@angular/core/testing';

import { CustomertaskService } from './customertask.service';

describe('CustomertaskService', () => {
  let service: CustomertaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomertaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
