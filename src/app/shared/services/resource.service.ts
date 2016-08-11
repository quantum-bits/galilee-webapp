import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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

  constructor(private http:Http) {
  }

  /**
   * Retrieve a list of the resource types.
   * @returns {Observable<R>}
   */
  getResourceTypes():Observable<any> {
    return this.http.get('http://localhost:3000/resources/types')
      .map(res => res.json());
  }

  createCollection(title, description) {
  }

  getResources() {
    var promise = Promise.resolve(RESOURCES);// Observable.just(READINGS);
    return Observable.fromPromise(promise);
  }

  getResourcePath() {
    var promise = Promise.resolve(PATH);// Observable.just(READINGS);
    return Observable.fromPromise(promise);
  }
}
