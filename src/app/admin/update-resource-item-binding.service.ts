import { Injectable } from '@angular/core';

import { Subject }    from 'rxjs/Subject';


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

  updateResource(resource) {
    console.log('inside the service');
    console.log(resource);
    this.resourceUpdatedSource.next(resource);
  }

  deleteResource(resourceID) {
    console.log('inside the service');
    console.log(resourceID);
    this.resourceDeletedSource.next(resourceID);
  }

}
