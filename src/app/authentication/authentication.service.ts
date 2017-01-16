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
  constructor(private http: Http) {
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post('http://localhost:3000/authenticate', {email, password})
      .map(res => res.json())
      .do((data: LoginData) => {
          if (data.status === "OK") {
            localStorage.setItem(TOKEN_KEY, data[TOKEN_KEY]);
            return data.user;
          } else {
            localStorage.removeItem(TOKEN_KEY);
            return null;
          }
        });
  }

  isloggedIn(): boolean {
    return tokenNotExpired();
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }
}
