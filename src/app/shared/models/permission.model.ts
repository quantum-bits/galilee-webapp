export const EDIT_RES = 'EDIT_RES';
export const EDIT_PRAC = 'EDIT_PRAC';
export const ADMIN = 'ADMIN';

export class Permission {
  id: string;
  title: string;

  constructor (obj){
    this.id = obj.id;
    this.title = obj.title;
  }
}

