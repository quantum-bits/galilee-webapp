import {Permission} from './permission.model';

export const enum PermissionFilterType {
  can,
  cannot,
  either
}

export class PermissionFilter extends Permission {
  filter: PermissionFilterType;

  constructor(obj){
    super({id: obj.id, title: obj.title});
    this.filter = obj.filter;
  }

}
