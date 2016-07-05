/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { UpdatePracticeItemBindingService } from './update-practice-item-binding.service';

describe('UpdatePracticeItemBinding Service', () => {
  beforeEachProviders(() => [UpdatePracticeItemBindingService]);

  it('should ...',
      inject([UpdatePracticeItemBindingService], (service: UpdatePracticeItemBindingService) => {
    expect(service).toBeTruthy();
  }));
});
