/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JournalEntriesListComponent } from './journal-entry-list.component';

describe('JournalEntriesListComponent', () => {
  let component: JournalEntriesListComponent;
  let fixture: ComponentFixture<JournalEntriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalEntriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
