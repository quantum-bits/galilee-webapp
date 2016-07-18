/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { ReadingItemComponent } from './reading-item.component';

describe('Component: ReadingItem', () => {
  it('should create an instance', () => {
    let component = new ReadingItemComponent();
    expect(component).toBeTruthy();
  });
});
