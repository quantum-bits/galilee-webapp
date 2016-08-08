import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Rx';

// interface for users?!?

// MOCK
const USERS = [
  {
    id: 1,
    email: 'john@gmail.com',
    password: 'hash?',
    firstName: 'John',
    lastName: 'Ztgmail',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 1,
    canEditPractices: false,
    canEditResources: true
  },
  {
    id: 2,
    email: 'jane@gmail.com',
    password: 'hash?',
    firstName: 'Jane',
    lastName: 'Atgmaal',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 2,
    canEditPractices: true,
    canEditResources: true
  },
  {
    id: 3,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'Atthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  },
  {
    id: 4,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'Btthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  },
  {
    id: 5,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'Btthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  },
  {
    id: 6,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'Ctthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  },
  {
    id: 7,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'Dtthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  },
  {
    id: 8,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'Dtthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  },
  {
    id: 9,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'Etthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  },
  {
    id: 10,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'BBtthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  },
  {
    id: 11,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'Fgtthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  },
  {
    id: 12,
    email: 'jean@gmail.com',
    password: 'hash?',
    firstName: 'Jean',
    lastName: 'aatthemall',
    joinedOn: 'date-format',
    enabled: true,
    preferredVersionID: 14,
    canEditPractices: false,
    canEditResources: false
  }
]

const ROLES = [
  {
    id: 1,
    title: ''
  }


]

@Injectable()
export class UserManagementService {

  constructor() {}


  getUsers() {
    var promise = Promise.resolve(USERS);// Observable.just(USERS);
    return Observable.fromPromise(promise);
  }

  getUser(id: number){}

  getUserByName(nameFragment: string){}

  getRoles(){}



}
