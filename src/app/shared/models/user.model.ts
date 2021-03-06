import {Permission} from './permission.model';
import {Version} from '../interfaces/version.interface';


export interface Organization {
  id: number;
  name: string;
  created_at: string; //TODO: fix (should be createdAt)
  updated_at: string; //TODO: fix (should be updatedAt)
}

export interface AbbreviatedUser {
  // used inside of IGroup and Group definitions;
  // User includes Group, so if Group includes the full User object,
  // we will have a problem with recursion...!
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IGroup {
  id: number;
  name: string;
  organization: Organization;
  createdAt: string;
  enabled: boolean;
  members?: Array<AbbreviatedUser>
}

export class Group implements IGroup {
  id: number;
  name: string;
  organization: Organization;
  createdAt: string;
  enabled: boolean;
  members: Array<AbbreviatedUser>;

  constructor (obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.organization = obj.organization;
    this.createdAt = obj.createdAt;
    this.enabled = obj.enabled;
    this.members = [];
    if (obj.members) {
      obj.members.forEach(member => {
        this.members.push(member);
      });
    }
  }

  public isEnabled() {
    return this.enabled;
  }

  static compare(element1: Group, element2: Group, fieldName: string, sortAscending: boolean){
    // fieldName should be 'name', 'organization', 'numberMembers' or 'createdAt';
    // returns +/- 1 or 0 depending on element1 and element2 and on the
    // sortAscending boolean; returns 0 if the fieldName does not match one of the
    // specified values
    let returnVal = 0;

    if (fieldName === 'name') {
      if (element1[fieldName].toLowerCase() > element2[fieldName].toLowerCase()) {
        returnVal = 1;
      }
      if (element1[fieldName].toLowerCase() < element2[fieldName].toLowerCase()) {
        returnVal = -1;
      }
    } else if (fieldName === 'organization') {
      if (element1['organization'].name.toLowerCase() > element2['organization'].name.toLowerCase()) {
        returnVal = 1;
      }
      if (element1['organization'].name.toLowerCase() < element2['organization'].name.toLowerCase()) {
        returnVal = -1;
      }
    } else if (fieldName === 'numberMembers') {
      if (element1['members'].length > element2['members'].length) {
        returnVal = 1;
      }
      if (element1['members'].length < element2['members'].length) {
        returnVal = -1;
      }
    } else if (fieldName === 'createdAt') {
      let date1 = new Date(element1[fieldName]);
      let date2 = new Date(element2[fieldName]);
      if (date1 < date2) {
        returnVal = 1;
      }
      if (date1 > date2) {
        returnVal = -1;
      }
    }

    if (!sortAscending) {
      returnVal = - returnVal;
    }

    return returnVal;
  }





}



export class User {
  avatarUrl: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  joinedOn: string;
  enabled: boolean;
  preferredVersionId: number;
  permissions: Array<Permission>;
  groups: Array<IGroup>;
  version: Version;

  constructor(obj){
    this.avatarUrl = obj.avatarUrl;
    this.id = obj.id;
    this.email = obj.email;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.joinedOn = obj.joinedOn;
    this.enabled = obj.enabled;
    this.preferredVersionId = obj.preferredVersionId;

    // TODO: This can probably be simplified.
    this.permissions = [];
    obj.permissions.forEach(permission => {
      this.permissions.push(new Permission(permission));
    });
    this.groups = [];
    obj.groups.forEach(group => {
      this.groups.push(group);
    });

    this.version = obj.version;
  }

  public isEnabled() {
    return this.enabled;
  }

  can(permissionID: string){
    for (let permission of this.permissions){
      if (permission.id === permissionID) {
        return true;
      }
    }
    return false;
  }

  fullName(){
    return `${this.firstName} ${this.lastName}`;
  }

  inGroups(){
    return !(this.groups == null || this.groups.length == 0);
  }

  static compare(element1: User, element2: User, fieldName: string, sortAscending: boolean){
    // fieldName should be 'firstName', 'lastName', 'email', or 'joinedOn';
    // returns +/- 1 or 0 depending on element1 and element2 and on the
    // sortAscending boolean; returns 0 if the fieldName does not match one of the
    // specified values
    let returnVal = 0;

    if (fieldName === 'firstName' || fieldName === 'lastName' || fieldName === 'email') {
      if (element1[fieldName].toLowerCase() > element2[fieldName].toLowerCase()) {
        returnVal = 1;
      }
      if (element1[fieldName].toLowerCase() < element2[fieldName].toLowerCase()) {
        returnVal = -1;
      }
    } else if (fieldName === 'joinedOn') {
      let date1 = new Date(element1[fieldName]);
      let date2 = new Date(element2[fieldName]);
      if (date1 < date2) {
        returnVal = 1;
      }
      if (date1 > date2) {
        returnVal = -1;
      }
    }

    if (!sortAscending) {
      returnVal = - returnVal;
    }

    return returnVal;
  }
}
