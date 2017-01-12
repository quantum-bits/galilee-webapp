import {Injectable} from '@angular/core';

import {AuthenticationService} from './authentication.service';

import {contentHeaders} from './common/headers';

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

  constructor(private authenticationService: AuthenticationService) {
  }

  login(username, password) {
    this.authenticationService.login(username, password)
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

  signup(username, password) {
    // return this.http
    //   .post(
    //     baseUrl + '/users',
    //     JSON.stringify({username, password}),
    //     {headers: contentHeaders}
    //   )
    //   .map(
    //     res => {
    //       localStorage.setItem('id_token', res.json().id_token);
    //       console.log(res);
    //       this.loggedIn = true;
    //       return res;
    //     })
  }

  logout() {
    this.authenticationService.logout();
    this.currentUser = null;
  }

  isLoggedIn() {
    return this.authenticationService.isloggedIn();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUsers() {
    // let users: User[] = [];
    //
    // for (let user of USERS) {
    //   let userPermissions: UserPermission[] = [];
    //   for (let permission of user.permissions) {
    //     userPermissions.push(new UserPermission(
    //       {
    //         enabled: permission.enabled,
    //         id: permission.id,
    //         title: permission.title
    //       }
    //       )
    //     )
    //   }
    //   users.push(new User(
    //     {
    //       id: user.id,
    //       email: user.email,
    //       password: user.password,
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       joinedOn: user.joinedOn,
    //       enabled: user.enabled,
    //       preferredVersionID: user.preferredVersionID,
    //       permissions: userPermissions
    //     })
    //   )
    // }
    //
    // var promise = Promise.resolve(users);// Observable.just(USERS);
    // return Observable.fromPromise(promise);
  }

  getPermissionTypes() {
    // var promise = Promise.resolve(PERMISSION_TYPES);// Observable.just(USERS);
    // return Observable.fromPromise(promise);
  }

  getInitialUserPermissions() {
    // Return a UserPermission-like dictionary with initial data;
    // used to populate the form for creating a new user.
    // var initialUserPermissions = [];
    //
    // for (let permission of PERMISSION_TYPES) {
    //   initialUserPermissions.push({
    //     title: permission.title,
    //     id: permission.id,
    //     enabled: false
    //   });
    // }
    //
    // var promise = Promise.resolve(initialUserPermissions);
    // return Observable.fromPromise(promise);
  }

}
