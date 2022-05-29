import { TestBed } from '@angular/core/testing';

import { QuestTypeService } from './quest-type.service';

describe('QuestTypeService', () => {
  let service: QuestTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
