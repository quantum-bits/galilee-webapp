/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { ReadingsComponent } from './readings.component';

describe('Component: Readings', () => {
  it('should create an instance', () => {
    let component = new ReadingsComponent();
    expect(component).toBeTruthy();
  });
});
