/**
 * See:
 *   https://angularjs.blogspot.com/2016/11/easy-angular-authentication-with-json.html
 *   https://auth0.com/blog/hapijs-authentication-secure-your-api-with-json-web-tokens/
 */

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import {tokenNotExpired} from 'angular2-jwt';

import {LoginData} from '../shared/interfaces/login-data.interface';
import {User} from '../shared/models/user.model';

import {JWT_TOKEN_KEY} from '../shared/constants';

@Injectable()
export class AuthenticationService {
  // Redirect here after logging in.
  redirectUrl: string = "";

  constructor(private http: Http) {
  }

  authenticate(email: string, password: string): Observable<User> {
    return this.http.post('/api/authenticate', {email, password})
      .map(response => {
        if (response.ok) {
          let loginData: LoginData = response.json();
          localStorage.setItem(JWT_TOKEN_KEY, loginData[JWT_TOKEN_KEY]);
          return new User(loginData.user);
        } else {
          localStorage.removeItem(JWT_TOKEN_KEY);
          return null;
        }
      });
  }

  isAuthenticated(): boolean {
    return tokenNotExpired(JWT_TOKEN_KEY);
  }

  revokeAuthentication(): void {
    localStorage.removeItem(JWT_TOKEN_KEY);
  }
}
