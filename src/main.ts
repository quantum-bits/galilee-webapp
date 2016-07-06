import {bootstrap} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {AppComponent, environment} from './app';
import {APP_ROUTER_PROVIDERS} from './app/app.routes';
import {HTTP_PROVIDERS} from '@angular/http';

import "angular2-materialize";
import "ng2-file-upload";

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent,
  [
    HTTP_PROVIDERS,
    APP_ROUTER_PROVIDERS
  ]).catch(err => console.error(err));
