import {User} from '../models/user.model';

export interface LoginData {
  ok: boolean,
  message: string,
  id_token: string;
  user: User;
}
