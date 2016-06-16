/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { PracticeService } from './practice.service';

describe('Practice Service', () => {
  beforeEachProviders(() => [PracticeService]);

  it('should ...',
      inject([PracticeService], (service: PracticeService) => {
    expect(service).toBeTruthy();
  }));
});
