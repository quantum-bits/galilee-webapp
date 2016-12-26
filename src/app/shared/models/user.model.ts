import {UserPermission} from './user-permission.model';

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  joinedOn: string;
  enabled: boolean;
  preferredVersionID: number;
  permissions: UserPermission[];

  constructor(obj){
    this.id = obj.id;
    this.email = obj.email;
    this.password = obj.password;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.joinedOn = obj.joinedOn;
    this.enabled = obj.enabled;
    this.preferredVersionID = obj.preferredVersionID;
    this.permissions = obj.permissions;
  }

  isEnabled() {
    return this.enabled;
  }

  indexOfPermission(permissionID: string) {
    // Fetch the array index for the permission with the given id.
    for (let i in this.permissions){
      if (this.permissions[i].id === permissionID) {
        return i;
      }
    }
    throw new Error(`No permission with ID ${permissionID}`);
  }

  can(permissionID: string){
    let index = this.indexOfPermission(permissionID);
    return this.permissions[index].can();
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
