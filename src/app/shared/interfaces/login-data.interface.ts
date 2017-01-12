import {User} from '../models/user.model';

export interface LoginData {
  status: string;
  id_token: string;
  user: User;
}
