/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import {Permission} from './permission.model';

describe('Permission', () => {
  it('should create an instance', () => {
    expect(new Permission()).toBeTruthy();
  });
});
