/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { ResourceService } from './resource.service';

describe('Resource Service', () => {
  beforeEachProviders(() => [ResourceService]);

  it('should ...',
      inject([ResourceService], (service: ResourceService) => {
    expect(service).toBeTruthy();
  }));
});
