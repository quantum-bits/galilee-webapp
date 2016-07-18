/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { PracticeItemComponent } from './practice-item.component';

describe('Component: PracticeItem', () => {
  it('should create an instance', () => {
    let component = new PracticeItemComponent();
    expect(component).toBeTruthy();
  });
});
