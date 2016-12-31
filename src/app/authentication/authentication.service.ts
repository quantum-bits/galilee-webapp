/**
 * See:
 *   https://angularjs.blogspot.com/2016/11/easy-angular-authentication-with-json.html
 *   https://auth0.com/blog/hapijs-authentication-secure-your-api-with-json-web-tokens/
 */

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {
  constructor(private router: Router,
              private http: Http) {
  }

  login(email: string, password: string) {
    this.http.post('http://localhost:3000/authenticate', {email, password})
      .map(res => res.json())
      .subscribe(
        // We're assuming the response will be an object
        // with the JWT on an id_token key
        data => {
          localStorage.setItem('id_token', data.id_token);
          this.router.navigate(['/end-user']);
        },
        error => {
          console.log('Error from AuthService.login:', error);
        });
  }

  isloggedIn() {
    return tokenNotExpired();
  }

  logout() {
    localStorage.removeItem('id_token');
  }
}
