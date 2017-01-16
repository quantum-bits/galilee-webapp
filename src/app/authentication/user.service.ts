import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {AuthenticationService} from './authentication.service';

import {User} from '../shared/models/user.model';
import {Permission} from '../shared/models/permission.model';
import {UserPermission} from '../shared/models/user-permission.model';

//import localStorage from 'localStorage'; // I'm not sure why, but we apparently don't need to do this....

/*
 Some examples of sending authenticated requests to the server may be found here:

 https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.6y6tryhmo
 https://github.com/auth0-blog/angular2-authentication-sample/blob/master/src/home/home.ts

 NOTE: The latter uses authHttp, which (I think) uses the angular2-jwt package.  We have
 installed that package, but it is not set up all the way yet (gives errors).  The
 former approach sends an authenticated request without the help of the angular2-jwt package.

 dates:
 ISO-8601 standard: YYYY-MM-DDTHH:mm:ss.sssZ
 ref: http://www.w3schools.com/jsref/jsref_tojson.asp

 broadcasting: ReplaySubject (for cases when the receiver may have missed the broadcast):
 https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/replaysubject.md
 */
const baseUrl = 'http://localhost:3001';

@Injectable()
export class UserService {
  private currentUser: User;

  constructor(private authenticationService: AuthenticationService,
              private http: Http) {
  }

  login(email, password) {
    this.authenticationService.login(email, password)
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          console.log("Logged in", user);
        } else {
          this.currentUser = null;
          console.log("Login failed");
        }
      });
  }

  signup(email, password, first_name, last_name) {
    return this.http
      .post('http://localhost:3000/users/signup', {
        email: email,
        password: password,
        first_name: first_name,
        last_name: last_name
      });
  }

  logout() {
    this.authenticationService.logout();
    this.currentUser = null;
  }

  isLoggedIn() {
    return this.authenticationService.isloggedIn();
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  getUsers() {
    return this.http.get('http://localhost:3000/users')
      .map(res => res.json());
  }

  getPermissionTypes() {
    // TODO: How do these two methods differ??
    return this.getInitialUserPermissions();
  }

  getInitialUserPermissions() {
    return this.http.get('http://localhost:3000/users/permissions')
      .map(res => res.json());
  }

}
