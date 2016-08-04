import {bootstrap} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {AppComponent, environment} from './app';
import {APP_ROUTER_PROVIDERS} from './app/app.routes';
import {HTTP_PROVIDERS} from '@angular/http';
import {disableDeprecatedForms, provideForms } from '@angular/forms';

import { UserService } from './app/authentication/user.service';
import { AuthGuard } from './app/authentication/common/auth.guard';
//import { AUTH_PROVIDERS } from 'angular2-jwt';

//import "angular2-jwt";
import "angular2-materialize";
import "ng2-file-upload";

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent,
  [
    HTTP_PROVIDERS,
    APP_ROUTER_PROVIDERS,
//    AUTH_PROVIDERS,
    AuthGuard,
    disableDeprecatedForms(),
    provideForms(),
    UserService,
  ]).catch(err => console.error(err));
