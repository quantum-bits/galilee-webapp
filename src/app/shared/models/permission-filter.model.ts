import {Permission} from './permission.model';

export const enum PermissionFilterType {
  can,
  cannot,
  either
}

export class PermissionFilter extends Permission {
  filter: PermissionFilterType;
}
