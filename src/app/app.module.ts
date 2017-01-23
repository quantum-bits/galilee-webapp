import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from "@angular/router";

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

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {enableTracing: true}),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterializeModule,
    MomentModule,
    Ng2PaginationModule,
    EndUserModule,
    AdminModule,
    AuthenticationModule,
    Ng2CompleterModule,
    DatePickerModule
  ],
  declarations: [
    AppComponent,
    DialogComponent,
    SelfUpdateComponent
  ],
  providers: [FormBuilder],
  //NOTE: (1) AuthGuard has been commented out in admin.routes for the moment
  //      (2) I don't know if this is the correct place to put the AuthGuard declaration...in rc4 it was included as part of the bootstrapping process
  entryComponents: [AppComponent, DialogComponent],// not sure if EditUserComponent needs to be here....
  bootstrap: [AppComponent]
})
export class AppModule {

}
