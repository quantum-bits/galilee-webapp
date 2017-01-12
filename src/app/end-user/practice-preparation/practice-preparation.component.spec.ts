/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PracticePreparationComponent } from './practice-preparation.component';

describe('PracticePreparationComponent', () => {
  let component: PracticePreparationComponent;
  let fixture: ComponentFixture<PracticePreparationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticePreparationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticePreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
