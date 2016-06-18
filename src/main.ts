import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';

import "angular2-materialize";

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS
])
  .catch(err => console.error(err));
