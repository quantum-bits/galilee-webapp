import {LoginComponent} from './login';
import {SignupComponent} from './signup';
import {SelfUpdateComponent} from './self-update';

export const AuthenticationRoutes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'update-preferences',
    component: SelfUpdateComponent
  },
];
