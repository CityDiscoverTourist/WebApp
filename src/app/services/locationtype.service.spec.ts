import { TestBed } from '@angular/core/testing';

import { LocationtypeService } from './locationtype.service';

describe('LocationtypeService', () => {
  let service: LocationtypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationtypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
