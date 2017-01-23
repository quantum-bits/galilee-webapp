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

const TOKEN_KEY: string = 'id_token';

@Injectable()
export class AuthenticationService {
  // Redirect here after logging in.
  redirectUrl: string = "";

  constructor(private http: Http) {
  }

  authenticate(email: string, password: string): Observable<User> {
    return this.http.post('http://localhost:3000/authenticate', {email, password})
      .map(res => {
        let loginData: LoginData = res.json();

        if (loginData.ok) {
          localStorage.setItem(TOKEN_KEY, loginData[TOKEN_KEY]);
          return new User(loginData.user);
        }

        localStorage.removeItem(TOKEN_KEY);
        return null;
      });
  }

  isAuthenticated(): boolean {
    return tokenNotExpired();
  }

  revokeAuthentication(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
