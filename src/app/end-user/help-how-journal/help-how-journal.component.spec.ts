import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpHowJournalComponent } from './help-how-journal.component';

describe('HelpHowJournalComponent', () => {
  let component: HelpHowJournalComponent;
  let fixture: ComponentFixture<HelpHowJournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpHowJournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpHowJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
