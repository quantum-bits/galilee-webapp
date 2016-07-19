import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Rx';

// MOCK
const RESOURCES = [
  {
    id: 1,
    type: 'image',
  },
  {
    id: 2,
    type: 'audio',
  },
  {
    id: 3,
    type: 'video',
  },
  {
    id: 4,
    type: 'link',
  }
];

const PATH = 'app/images_temp/';

@Injectable()
export class ResourceService {

  constructor() {}

  getResources() {
    var promise = Promise.resolve(RESOURCES);// Observable.just(READINGS);
    return Observable.fromPromise(promise);
  }

  getResourcePath() {
    var promise = Promise.resolve(PATH);// Observable.just(READINGS);
    return Observable.fromPromise(promise);
  }





}
