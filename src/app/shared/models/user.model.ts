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
  permission: UserPermission[]
}
