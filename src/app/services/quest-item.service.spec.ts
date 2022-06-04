import { TestBed } from '@angular/core/testing';

import { QuestItemService } from './quest-item.service';

describe('QuestItemService', () => {
  let service: QuestItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
