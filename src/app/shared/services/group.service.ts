import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Rx';

import { IGroup } from '../models/user.model';

// MOCK
const GROUPS: IGroup[] = [
  {
    id:             1,
    name:           'Second North Euler',
    organization: {
      id: 1,
      name: 'Taylor University',
      created_at: '2015-02-19 17:52:03.894191-05',
      updated_at: '2015-02-19 17:52:03.894191-05'
    },
    createdAt:      '2017-02-19 17:52:03.894191-05',
    enabled:        true,
    members: [
      {
        id: 1,
        email: 'joe@example.com',
        firstName: 'Joe',
        lastName: 'Student'
      },
      {
        id: 2,
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Stuudent'
      },
    ]
  },
  {
    id:             2,
    name:           'SNAS',
    organization: {
      id: 2,
      name: 'Anderson University',
      created_at: '2015-01-19 17:52:03.894191-05',
      updated_at: '2015-01-19 17:52:03.894191-05'
    },
    createdAt:      '2017-04-19 17:52:03.894191-05',
    enabled:        false,
    members: [
      {
        id: 3,
        email: 'jooe@example.com',
        firstName: 'Jooe',
        lastName: 'Staadent'
      },
      {
        id: 4,
        email: 'jaane@example.com',
        firstName: 'Jaane',
        lastName: 'Tsaadent'
      },
    ]
  },
  {
    id:             3,
    name:           'Cool Wing',
    organization: {
      id: 1,
      name: 'Taylor University',
      created_at: '2015-02-19 17:52:03.894191-05',
      updated_at: '2015-02-19 17:52:03.894191-05'
    },
    createdAt:      '2016-01-19 17:52:03.894191-05',
    enabled:        true,
    members: []
  }
];


@Injectable()
export class GroupService {

  constructor() { }

  getGroups() {
    let promise = Promise.resolve(GROUPS);
    return Observable.fromPromise(promise);
  }


}
