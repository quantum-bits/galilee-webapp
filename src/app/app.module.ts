import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, Http, RequestOptions} from '@angular/http';
import {RouterModule, Routes} from "@angular/router";

import {AuthConfig, AuthHttp} from 'angular2-jwt';

import {AdminModule} from './admin/admin.module';
import {AppComponent} from './app.component';
import {AuthenticationModule} from './authentication/authentication.module';
import {DialogComponent} from './admin/temp/dialog.component';
import {EndUserModule} from './end-user/end-user.module';
import {SelfUpdateComponent} from './authentication/self-update';

import {MaterializeModule} from "angular2-materialize";
import {DatePickerModule} from 'ng2-datepicker';
import {MomentModule} from 'angular2-moment';
import {Ng2CompleterModule} from "ng2-completer";
import {Ng2PaginationModule} from 'ng2-pagination';

const routes: Routes = [
  {path: '', redirectTo: '/end-user/readings/today', pathMatch: 'full'}
];

// TODO: Figure out why this is declared as it is (from the angular2-jwt docs).
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
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
    Ng2PaginationModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    DialogComponent,
    SelfUpdateComponent
  ],
  providers: [
    FormBuilder,
    { provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  entryComponents: [AppComponent, DialogComponent],// not sure if EditUserComponent needs to be here....
  bootstrap: [AppComponent]
})
export class AppModule {
}
