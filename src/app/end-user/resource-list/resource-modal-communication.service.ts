import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Rx';
import {Subject}    from 'rxjs/Subject';

@Injectable()
export class ResourceModalCommunicationService {

  private modalClosedSource = new Subject();

  modalClosed$ = this.modalClosedSource.asObservable();

  constructor() { }

  announceModalClosed() {
    //console.log('inside service....');
    this.modalClosedSource.next();
  }

}
