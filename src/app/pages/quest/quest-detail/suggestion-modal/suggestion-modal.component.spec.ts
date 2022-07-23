import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionModalComponent } from './suggestion-modal.component';

describe('SuggestionModalComponent', () => {
  let component: SuggestionModalComponent;
  let fixture: ComponentFixture<SuggestionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
