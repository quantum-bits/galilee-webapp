/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { UserManagementService } from './user-management.service';

describe('UserManagement Service', () => {
  beforeEachProviders(() => [UserManagementService]);

  it('should ...',
      inject([UserManagementService], (service: UserManagementService) => {
    expect(service).toBeTruthy();
  }));
});
