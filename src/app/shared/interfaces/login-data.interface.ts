import {User} from '../models/user.model';

export interface LoginData {
  ok: boolean,
  message: string,
  jwtIdToken: string;   // Key must match value of shared.constants.JWT_TOKEN_KEY
  user: User;
}
