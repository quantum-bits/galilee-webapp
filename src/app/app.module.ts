import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, Http, RequestOptions} from '@angular/http';
import {RouterModule, Routes} from "@angular/router";

import {AuthConfig, AuthHttp} from 'angular2-jwt';

import {AdminModule} from './admin/admin.module';
import {AppComponent} from './app.component';
import {AuthenticationModule} from './authentication/authentication.module';
import {EndUserModule} from './end-user/end-user.module';
import {SelfUpdateComponent} from './authentication/self-update';
import {JWT_TOKEN_KEY} from './shared/constants';

import {MaterializeModule} from "angular2-materialize";
import {DatePickerModule} from 'ng2-datepicker';
import {MomentModule} from 'angular2-moment';
import {Ng2CompleterModule} from "ng2-completer";
import {NgxPaginationModule} from 'ngx-pagination';
import { FacebookModule } from 'ngx-facebook';

// the following attempts to implement lazy loading of the admin module
// TODO: probably need to remove AdminModule from the imports[] list below;
//       currently that makes the app gag.  This may be because the edit-user
//       component (inside the AdminModule) is used in various parts of the app; not sure....
const routes: Routes = [
  {path: '', redirectTo: '/end-user/readings/today', pathMatch: 'full'},
  { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule' }
];

// We use noJwtError so that if there is no token in local storage,
// we can still make authHttp requests to endpoints that have authentication
// configured with `mode: try` (e.g., `GET /readings/meta`). Otherwise,
// a non-authenticated user could not fetch date navigation metadata.
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: JWT_TOKEN_KEY,
    tokenGetter: (() => localStorage.getItem(JWT_TOKEN_KEY)),
    noJwtError: true
  }), http, options);
}

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {enableTracing: true}),
    AdminModule,
    AuthenticationModule,
    DatePickerModule,
    EndUserModule,
    FormsModule,
    HttpModule,
    MaterializeModule,
    MomentModule,
    Ng2CompleterModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FacebookModule.forRoot()
  ],
  declarations: [
    AppComponent,
    SelfUpdateComponent
  ],
  providers: [
    FormBuilder,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
