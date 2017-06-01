import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {Subject, BehaviorSubject, Observable} from 'rxjs';

//import {Observable} from 'rxjs/Observable';

import {AuthHttp} from 'angular2-jwt';

import {AuthenticationService} from './authentication.service';

import {ReadingService} from '../shared/services/reading.service';

import {User} from '../shared/models/user.model';
import {LoginData} from '../shared/interfaces/login-data.interface';
import {Version} from '../shared/interfaces/version.interface';

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

const DEFAULT_REDIRECT_URL = '/end-user/readings/today';
const CURRENT_USER_KEY = 'current-user';

@Injectable()
export class UserService {
  // TODO: There must be a better way to expose state as an observable.
  private currentUser: User;

  private observableUser: Subject<User> = new BehaviorSubject<User>(null);

  // Observable used to inform the Login page that there has been a problem
  // with authentication
  private authenticationFailureSource = new Subject<string>();
  authenticationFailure$ = this.authenticationFailureSource.asObservable();

  // Observable used to signal that the create/edit user modal in the
  // Manage Users page should be closed, and the dynamically-created
  // component should be cleared
  private closeAndCleanUpSource = new Subject<boolean>();
  closeAndCleanUp$ = this.closeAndCleanUpSource.asObservable();

  // Redirect here after updating account information.
  redirectUrl: string = "";

  constructor(private authenticationService: AuthenticationService,
              private readingService: ReadingService,
              private authHttp: AuthHttp,
              private router: Router,
              private http: Http) {
    // Load up the current user if there's one in local storage.
    let userData: string = localStorage.getItem(CURRENT_USER_KEY);
    if (userData) {
      let user: User = new User(JSON.parse(userData));
      this.setCurrentUser(user);
    }
  }

  login(email: string, password: string) {
    this.authenticationService.authenticate(email, password)
      .subscribe((user: User) => {
        if (this.authenticationService.isAuthenticated()) {
          this.setCurrentUser(user);
          // clear the readings data and currentVersionId so the user starts with a fresh set-up
          this.readingService.dumpStoredReadings();
          this.readingService.unSetCurrentVersion();
          let redirect = this.authenticationService.redirectUrl || DEFAULT_REDIRECT_URL;
          this.router.navigate([redirect]);
        } else {
          this.clearCurrentUser();
        }
      },
      error => this.announceAuthenticationFailure(error)//._body).message));
      );
  }

  announceAuthenticationFailure(message){
    this.authenticationFailureSource.next(message);
  }

  announceCloseAndCleanUp(refreshUsers: boolean){
    this.closeAndCleanUpSource.next(refreshUsers);
  }

  // TODO: Delete me.
  update(user: User) {
    // return this.updateName(user.id, user.firstName, user.lastName);
    // return this.updateEmail(user.id, user.email);
    return this.updatePassword(user.id, 'reallygoodpassword');
  }

  updateName(userId: number, firstName: string, lastName: string) {
    return this.authHttp
      .patch(`/api/users/name`, {firstName: firstName, lastName: lastName});
  }

  updateEmail(userId: number, email: string) {
    return this.authHttp
      .patch(`/api/users/email`, {email: email});
  }

  updatePassword(userId: number, password: string) {
    console.log('updating password: ', password);
    return this.authHttp
      .patch(`/api/users/password`, {password: password});
  }

  updatePreferredVersion(userId: number, preferredVersionId: number) {
    console.log('updating default version: ', preferredVersionId);
    return this.authHttp
      .patch(`/api/users/version`, {preferredVersionId: preferredVersionId});
  }

  getPreferredVersionId(): number {
    if (this.isLoggedIn()){
      //return this.currentUser;
      return this.currentUser.preferredVersionId;
    } else {
      return null;
    }
  }

  signup(email, password, firstName, lastName) {
    return this.http.post('/api/users', {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
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
    return this.authHttp.get('/api/admin/users')
      .map(res => res.json());
  }

  getPermissionTypes() {
    return this.http.get('/api/users/permissions')
      .map(res => res.json());
  }

  inGroups() {
    if (this.getCurrentUser() == null) {
      // hopefully this takes case of the case where this method
      // gets called and the user is not logged in; the == (as opposed to ===)
      // should catch both null and undefined
      return false;
    } else {
      return this.currentUser.inGroups();
    }

    /*
    else if (this.currentUser.groups == null || this.currentUser.groups.length == 0){
      return false;
    }
    else {
      return true;
    }
    */

  }

}
