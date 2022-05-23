import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestTypeDetailComponent } from './quest-type-detail.component';

describe('QuestTypeDetailComponent', () => {
  let component: QuestTypeDetailComponent;
  let fixture: ComponentFixture<QuestTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestTypeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
