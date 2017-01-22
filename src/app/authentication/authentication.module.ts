import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AdminModule} from '../admin/admin.module';
import {SharedModule} from '../shared/shared.module';

import {AuthGuard} from './auth.guard';
import {UserService}  from './user.service';
import {AuthenticationService} from './authentication.service';

import {LoginComponent} from './login';
import {SignupComponent} from './signup';
import {SelfUpdateComponent} from './self-update';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'update-preferences', component: SelfUpdateComponent}
];


@NgModule({
  imports: [
    AdminModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  providers: [AuthGuard, AuthenticationService, UserService]
})
export class AuthenticationModule {}
