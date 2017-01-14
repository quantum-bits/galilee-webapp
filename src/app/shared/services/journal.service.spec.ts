/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { JournalService } from './journal.service';

describe('JournalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JournalService]
    });
  });

  it('should ...', inject([JournalService], (service: JournalService) => {
    expect(service).toBeTruthy();
  }));
});
