import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';

// Refer to "Guard the Admin Feature" in the Angular advanced guide for routing and navigation.

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  // ActivatedRouteSnapshot -- future route that will be activated
  // RouterStateSnapshot -- future RouterState of the application,
  // should you pass through the guard check.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authenticationService.isAuthenticated()) {
      // Already logged in.
      return true;
    }

    // Store attempted URL for later.
    this.authenticationService.redirectUrl = url;

    // Go to the login page.
    this.router.navigate(['/login']);
    return false;
  }
}
