import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import {PracticesUrl} from '../urls';
import {Practice} from '../models/practice.model';

// MOCK
const PRACTICE_GENERAL_INFO = [
  {
    id: 1,
    title: 'Lectio Divina',
    information: "There is nothing new about Scripture engagement! As I hope you’ve seen, Scripture engagement is thoroughly taught in the Scriptures. Christians have been developing and practicing various Scripture engagement techniques for hundreds of years. The goal of this website is not to introduce you to some new means of connecting with God. Our hope is to train people in tried and true methods of experiencing God through the Bible. One Scripture engagement technique that has a long and rich history, and that has been experiencing resurgence in recent years, is lectio divina."
  },
  {
    id: 2,
    title:      'Praying Scripture',
    information: 'Here is some general information about praying scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 3,
    title:      'Journaling Scripture',
    information: 'Here is some general information about journaling scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 4,
    title:      'Memorizing Scripture',
    information: 'Here is some general information about memorizing scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 5,
    title:      'Dramatizing Scripture',
    information: 'Here is some general information about dramatizing scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 6,
    title:      'Singing Scripture',
    information: 'Here is some general information about singing scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  }
];


@Injectable()
export class PracticeService {

  constructor(private http:Http) {  }

  /* deprecated
   getPractices(): Observable<Array<Practice>> {
    return this.http
      .get(PracticesUrl)
      .map(response => response.json());
  }
  */

  //MOCK...maybe this information will simply be in getPractices?!?
  getPracticeGeneralInformation(id) {
    for (var practice of PRACTICE_GENERAL_INFO) {
      if (practice.id === id) {
        var promise = Promise.resolve(practice);
        return Observable.fromPromise(promise);
      }
    }
  }


}
