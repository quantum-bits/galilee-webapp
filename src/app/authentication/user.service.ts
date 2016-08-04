import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
import { contentHeaders } from './common/headers';
//import localStorage from 'localStorage'; // I'm not sure why, but we apparently don't need to do this....

// Some examples of sending authenticated requests to the server may be found here:
//  https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.6y6tryhmo
//  https://github.com/auth0-blog/angular2-authentication-sample/blob/master/src/home/home.ts
// NOTE: The latter uses authHttp, which (I think) uses the angular2-jwt package.  We have
//       installed that package, but it is not set up all the way yet (gives errors).  The
//       former approach sends an authenticated request without the help of the angular2-jwt package.

const baseUrl = 'http://localhost:3001';

@Injectable()
export class UserService {
  private loggedIn = false;

  constructor(private http: Http) {
    this.loggedIn = !!localStorage.getItem('id_token');
    console.log('inside the user service constructor; user logged in?');
    console.log(this.loggedIn);
  }

  login(username, password) {
    return this.http
      .post(
        baseUrl+'/sessions/create',
        JSON.stringify({ username, password }),
        { headers: contentHeaders }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        localStorage.setItem('id_token', res.id_token);
        this.loggedIn = true;
        return this.loggedIn;
        /* // the back-end server I'm using does not return a 'success' property....
        if (res.success) {
          localStorage.setItem('id_token', res.id_token);
          this.loggedIn = true;
        }
        return res.success;
        */
      });
  }

  signup(username, password) {
    return this.http
      .post(
        baseUrl+'/users',
        JSON.stringify({ username, password }),
        { headers: contentHeaders }
      )
      .map(
        res => {
          localStorage.setItem('id_token', res.json().id_token);
          console.log(res);
          this.loggedIn = true;
          return res;
        })
  }

  logout() {
    localStorage.removeItem('id_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
