import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthenticationService} from './authentication.service';


@Injectable()
export class AuthGuard implements CanActivate {
  // see: https://github.com/auth0-blog/angular2-authentication-sample
  //      https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.r37i15mfh

  constructor(private auth: AuthenticationService,
              private router: Router) {
  }

  canActivate() {
    if (this.auth.isloggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
