/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DateNavSpyService } from './date-nav-spy.service';

describe('DateNavSpyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateNavSpyService]
    });
  });

  it('should ...', inject([DateNavSpyService], (service: DateNavSpyService) => {
    expect(service).toBeTruthy();
  }));
});
