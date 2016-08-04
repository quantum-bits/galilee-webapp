/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { UpdateResourceItemBindingService } from './update-resource-item-binding.service';

describe('UpdateResourceItemBinding Service', () => {
  beforeEachProviders(() => [UpdateResourceItemBindingService]);

  it('should ...',
      inject([UpdateResourceItemBindingService], (service: UpdateResourceItemBindingService) => {
    expect(service).toBeTruthy();
  }));
});
