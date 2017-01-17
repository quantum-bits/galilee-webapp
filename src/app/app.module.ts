import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {EndUserModule} from './end-user/end-user.module';
import {AdminModule} from './admin/admin.module';
import {AuthenticationModule} from './authentication/authentication.module';

import {SelfUpdateComponent} from './authentication/self-update';

import {MaterializeModule} from "angular2-materialize";

import {MomentModule} from 'angular2-moment';
import { Ng2CompleterModule } from "ng2-completer";

import {AppComponent} from './app.component';

import {Ng2PaginationModule} from 'ng2-pagination';

import {DialogComponent} from './admin/temp/dialog.component';


import {appRoutes} from './app.routes';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    SelfUpdateComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterializeModule,
    MomentModule,
    Ng2PaginationModule,
    EndUserModule,
    AdminModule,
    AuthenticationModule,
    Ng2CompleterModule
  ],
  providers: [FormBuilder],
  //NOTE: (1) AuthGuard has been commented out in admin.routes for the moment
  //      (2) I don't know if this is the correct place to put the AuthGuard declaration...in rc4 it was included as part of the bootstrapping process
  entryComponents: [AppComponent, DialogComponent],// not sure if EditUserComponent needs to be here....
  bootstrap: [AppComponent]
})
export class AppModule {

}
