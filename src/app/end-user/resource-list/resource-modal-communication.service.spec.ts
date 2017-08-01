import { TestBed, inject } from '@angular/core/testing';

import { ResourceModalCommunicationService } from './resource-modal-communication.service';

describe('ResourceModalCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceModalCommunicationService]
    });
  });

  it('should be created', inject([ResourceModalCommunicationService], (service: ResourceModalCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
