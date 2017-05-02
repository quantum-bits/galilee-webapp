/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UpdatePracticeFormFlyComponent } from './update-practice-form-fly.component';

describe('UpdatePracticeFormFlysComponent', () => {
  let component: UpdatePracticeFormFlyComponent;
  let fixture: ComponentFixture<UpdatePracticeFormFlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePracticeFormFlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePracticeFormFlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
