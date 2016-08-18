export const EDIT_RES = 'EDIT_RES';
export const EDIT_PRAC = 'EDIT_PRAC';
export const ADMIN = 'ADMIN';

/*
maybe switch to something more like this:

 class PermissionType {
    static EDIT_RES: string = "EDIT_RES";
    static EDIT_PRAC: string = "EDIT_PRAC";
    static ADMIN: string = "ADMIN";
 }
 */

export class Permission {
  id: string;
  title: string;

  constructor (obj){
    this.id = obj.id;
    this.title = obj.title;
  }
}

