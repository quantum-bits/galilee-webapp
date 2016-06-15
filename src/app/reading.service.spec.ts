/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { ReadingService } from './reading.service';

describe('Reading Service', () => {
  beforeEachProviders(() => [ReadingService]);

  it('should ...',
      inject([ReadingService], (service: ReadingService) => {
    expect(service).toBeTruthy();
  }));
});
