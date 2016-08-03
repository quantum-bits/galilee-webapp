import { LoginComponent } from './login';
import { SignupComponent } from './signup';

export const AuthenticationRoutes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
];
