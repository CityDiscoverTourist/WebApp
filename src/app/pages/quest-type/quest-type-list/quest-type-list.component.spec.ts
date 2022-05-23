import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestTypeListComponent } from './quest-type-list.component';

describe('QuestTypeListComponent', () => {
  let component: QuestTypeListComponent;
  let fixture: ComponentFixture<QuestTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
