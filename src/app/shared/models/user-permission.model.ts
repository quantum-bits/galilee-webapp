import {Permission} from './permission.model';

export class UserPermission extends Permission {
  enabled: boolean;

  constructor(obj) {
    super({id: obj.id, title: obj.title});
    this.enabled = obj.enabled;
  }

  can() {
    return this.enabled;
  }
}
