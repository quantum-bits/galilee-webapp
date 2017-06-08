import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Rx';
import {Subject} from 'rxjs';


import { IGroup, Organization } from '../models/user.model';


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

// MOCK
const ORGANIZATIONS: Organization[] = [
  {
    id: 1,
    name: 'Taylor University',
    created_at: '2015-02-19 17:52:03.894191-05',
    updated_at: '2015-02-19 17:52:03.894191-05'
  },
  {
    id: 2,
    name: 'Anderson University',
    created_at: '2015-01-19 17:52:03.894191-05',
    updated_at: '2015-01-19 17:52:03.894191-05'
  },
  {
    id: 3,
    name: 'Indiana Wesleyan University',
    created_at: '2015-01-19 17:52:03.894191-05',
    updated_at: '2015-01-19 17:52:03.894191-05'
  }
];


@Injectable()
export class GroupService {

  private closeAndCleanUpSource = new Subject<boolean>();
  closeAndCleanUp$ = this.closeAndCleanUpSource.asObservable();

  private closeAndCleanUpOrganizationsSource = new Subject<boolean>();
  closeAndCleanUpOrganizations$ = this.closeAndCleanUpOrganizationsSource.asObservable();

  constructor() { }

  getGroups() {
    let promise = Promise.resolve(GROUPS);
    return Observable.fromPromise(promise);
  }

  getOrganizations() {
    let promise = Promise.resolve(ORGANIZATIONS);
    return Observable.fromPromise(promise);
  }

  announceCloseAndCleanUp(refreshGroups: boolean){
    this.closeAndCleanUpSource.next(refreshGroups);
  }

  announceCloseAndCleanUpOrganizations(refreshOrganizations: boolean){
    this.closeAndCleanUpOrganizationsSource.next(refreshOrganizations);
  }




}
