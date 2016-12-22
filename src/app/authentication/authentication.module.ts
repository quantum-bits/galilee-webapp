import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AdminModule} from '../admin/admin.module';
import {SharedModule} from '../shared/shared.module';

import {AuthGuard} from './common/auth.guard';
import {UserService}  from './user.service';

import {LoginComponent} from './login';
import {SignupComponent} from './signup';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    SharedModule
  ],
  providers: [AuthGuard, UserService],

})
export class AuthenticationModule { }
