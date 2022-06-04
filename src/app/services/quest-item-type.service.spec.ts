import { TestBed } from '@angular/core/testing';

import { QuestItemTypeService } from './quest-item-type.service';

describe('QuestItemTypeService', () => {
  let service: QuestItemTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestItemTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
