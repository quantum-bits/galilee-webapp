/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { TextareaAutoresize } from './textarea-autoresize.directive';

describe('TextareaAutoresize Directive', () => {
  it('should create an instance', () => {
    let directive = new TextareaAutoresize();
    expect(directive).toBeTruthy();
  });
});
