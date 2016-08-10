/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import {UserPermission} from './user-permission.model';

describe('UserPermission', () => {
  it('should create an instance', () => {
    expect(new UserPermission()).toBeTruthy();
  });
});
