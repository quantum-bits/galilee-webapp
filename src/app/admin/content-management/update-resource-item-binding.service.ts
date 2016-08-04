import { Injectable } from '@angular/core';

import { Subject }    from 'rxjs/Subject';

import { ResourceCollection } from '../../shared/interfaces/resource-collection.interface';

@Injectable()
export class UpdateResourceItemBindingService {

  // Observable string sources
  private resourceUpdatedSource = new Subject();
  private resourceDeletedSource = new Subject();

  // Observable string streams
  resourceUpdated$ = this.resourceUpdatedSource.asObservable();
  resourceDeleted$ = this.resourceDeletedSource.asObservable();

  constructor() {}

  // Service message command(s)

  updateResource(dataPacket) {
    console.log('inside the service');
    console.log(dataPacket);
    this.resourceUpdatedSource.next(dataPacket);
  }

  deleteResource(resourceID) {
    console.log('inside the service');
    console.log(resourceID);
    this.resourceDeletedSource.next(resourceID);
  }

}
