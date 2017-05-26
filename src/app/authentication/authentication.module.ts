import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AdminModule} from '../admin/admin.module';
import {SharedModule} from '../shared/shared.module';

import {AuthGuard} from './auth.guard';
import {UserService}  from './user.service';
import {AuthenticationService} from './authentication.service';
import {ReadingService} from '../shared/services/reading.service';
import {MaterializeModule} from "angular2-materialize";

import {LoginComponent} from './login';
import {SignupComponent} from './signup';
import {SelfUpdateComponent} from './self-update';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { SignupSuccessComponent } from './signup-success/signup-success.component';

import {WarningMessageComponent} from '../shared/components/warning-message/warning-message.component';
import { SelfUpdateSuccessComponent } from './self-update-success/self-update-success.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signup-success', component: SignupSuccessComponent},
  {
    path: 'update-preferences',
    component: UpdateProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'self-update',
    component: SelfUpdateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'self-update-success',
    component: SelfUpdateSuccessComponent,
    canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [
    AdminModule,
    CommonModule,
    FormsModule,
    MaterializeModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    UpdateProfileComponent,
    SignupSuccessComponent,
    SelfUpdateSuccessComponent
  ],
  exports: [
  ],
  providers: [AuthGuard, AuthenticationService]//, UserService]
})
export class AuthenticationModule {}
