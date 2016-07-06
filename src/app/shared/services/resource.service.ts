import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Rx';

// MOCK
const RESOURCES = [
  {
    id: 1,
    title: 'image',
  },
  {
    id: 2,
    title: 'audio',
  },
  {
    id: 3,
    title: 'video',
  },
  {
    id: 4,
    title: 'link',
  }
];

@Injectable()
export class ResourceService {

  constructor() {}

  getResources() {
    var promise = Promise.resolve(RESOURCES);// Observable.just(READINGS);
    return Observable.fromPromise(promise);
  }




}
