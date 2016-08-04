import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';


@Injectable()
export class UpdatePracticeItemBindingService {

  // Observable string sources
  private practiceUpdatedSource = new Subject();
  private practiceDeletedSource = new Subject();

  // Observable string streams
  practiceUpdated$ = this.practiceUpdatedSource.asObservable();
  practiceDeleted$ = this.practiceDeletedSource.asObservable();

  constructor() {}

  // Service message command(s)

  updatePractice(practiceWithAdvice) {
    console.log('inside the service');
    console.log(practiceWithAdvice);
    this.practiceUpdatedSource.next(practiceWithAdvice);
  }

  deletePractice(practiceID) {
    console.log('inside the service');
    console.log(practiceID);
    this.practiceDeletedSource.next(practiceID);
  }

}
