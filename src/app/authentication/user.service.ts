import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {Subject, BehaviorSubject, Observable} from 'rxjs';

//import {Observable} from 'rxjs/Observable';

import {AuthHttp} from 'angular2-jwt';

import {AuthenticationService} from './authentication.service';

import {User} from '../shared/models/user.model';
import {LoginData} from '../shared/interfaces/login-data.interface';

import {Permission} from '../shared/models/permission.model';

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

const BASE_URL = 'http://localhost:3001';
const DEFAULT_REDIRECT_URL = '/end-user/dashboard';
const CURRENT_USER_KEY = 'current-user';

@Injectable()
export class UserService {
  private currentUser: User;

  // Is this kosher?
  private observableUser: Subject<User> = new BehaviorSubject<User>(null);

  constructor(private authenticationService: AuthenticationService,
              private authHttp: AuthHttp,
              private router: Router,
              private http: Http) {
    // Load up the current user if there's one in local storage.
    let user_data: string = localStorage.getItem(CURRENT_USER_KEY);
    if (user_data) {
      let user: User = new User(JSON.parse(user_data));
      this.setCurrentUser(user);
    }
  }

  login(email: string, password: string) {
    this.authenticationService.authenticate(email, password)
      .subscribe((user: User) => {
        if (this.authenticationService.isAuthenticated()) {
          this.setCurrentUser(user);
          let redirect = this.authenticationService.redirectUrl || DEFAULT_REDIRECT_URL;
          this.router.navigate([redirect]);
        } else {
          this.clearCurrentUser();
        }
      });
  }

  // TODO: Delete me.
  update(user: User) {
    // return this.updateName(user.id, user.firstName, user.lastName);
    // return this.updateEmail(user.id, user.email);
    return this.updatePassword(user.id, 'reallygoodpassword');
  }

  updateName(user_id: number, firstName: string, lastName: string) {
    return this.authHttp
      .patch(`http://localhost:3000/users/name`, {firstName: firstName, lastName: lastName});
  }

  updateEmail(user_id: number, email: string) {
    return this.authHttp
      .patch(`http://localhost:3000/users/email`, {email: email});
  }

  updatePassword(user_id: number, password: string) {
    return this.authHttp
      .patch(`http://localhost:3000/users/password`, {password: password});
  }


  signup(email, password, first_name, last_name) {
    return this.http.post('http://localhost:3000/users', {
      email: email,
      password: password,
      firstName: first_name,
      lastName: last_name
    });
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  watchCurrentUser(): Observable<User> {
    return this.observableUser;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    this.currentUser = user;
    this.observableUser.next(user);
  }

  private clearCurrentUser(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    this.currentUser = null;
    this.observableUser.next(null);
  }

  logout() {
    this.authenticationService.revokeAuthentication();
    this.clearCurrentUser();
  }

  can(permissionID: string): boolean {
    return this.isLoggedIn() && this.currentUser.can(permissionID);
  }

  isLoggedIn() {
    return this.authenticationService.isAuthenticated();
  }

  getUsers() {
    return this.authHttp.get('http://localhost:3000/admin/users')
      .map(res => res.json());
  }

  getPermissionTypes() {
    return this.http.get('http://localhost:3000/users/permissions')
      .map(res => res.json());
  }

}
