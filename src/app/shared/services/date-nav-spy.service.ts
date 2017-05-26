import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class DateNavSpyService {

  // Observable source
  private dateNavUpdatedSource = new Subject();
  // Observable stream
  dateNavUpdated$ = this.dateNavUpdatedSource.asObservable();

  constructor() { }

  broadcastDateNavUpdate() {
    //console.log('inside the date nav spy service');
    this.dateNavUpdatedSource.next('date nav updated!!!');
  }


}
