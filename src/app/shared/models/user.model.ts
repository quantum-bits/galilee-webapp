import {Permission} from './permission.model';

export interface Organization {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  //organization: Organization;
  organizationId: number;
  createdAt: string;
  enabled: boolean;
}

export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  joinedOn: string;
  enabled: boolean;
  preferredVersionID: number;
  permissions: Array<Permission>;
  groups: Array<Group>;

  constructor(obj){
    this.id = obj.id;
    this.email = obj.email;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.joinedOn = obj.joinedOn;
    this.enabled = obj.enabled;
    this.preferredVersionID = obj.preferredVersionId;

    // TODO: This can probably be simplified.
    this.permissions = [];
    obj.permissions.forEach(permission => {
      this.permissions.push(new Permission(permission));
    });
    this.groups = [];
    obj.groups.forEach(group => {
      this.groups.push(group);
    });


  }

  isEnabled() {
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
