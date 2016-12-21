import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ApplicationRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {MaterializeModule} from "angular2-materialize";

import {TruncatePipe} from './shared/pipes/truncate.pipe';
import {PaginatePipe} from 'ng2-pagination';
import {FileUploadModule} from 'ng2-file-upload';
import {MomentModule} from 'angular2-moment';

import {AppComponent} from './app.component';

import {Ng2PaginationModule} from 'ng2-pagination';
import {DragulaModule} from 'ng2-dragula/ng2-dragula';

// end-user components
import {ReadingItemComponent} from './end-user/reading-item';
import {ResourceItemComponent} from './end-user/resource-item';
import {PracticeItemComponent} from './end-user/practice-item';

import { InputWakeUp } from './shared/directives/input-wake-up.directive';
import { TextareaAutoresize } from './shared/directives/textarea-autoresize.directive';

import {EditUserComponent} from './admin/user-management/edit-user';
import {EditUserAnchorDirective} from './admin/user-management/edit-user-anchor.directive';

import { UpdatePracticesComponent } from './admin/content-management/update-practices';
import { UpdateResourcesComponent } from './admin/content-management/update-resources';
import { UpdatePracticeItemComponent } from './admin/content-management/update-practice-item';
import { UpdateResourceItemComponent } from './admin/content-management/update-resource-item';
import { UploadResourceComponent } from './admin/content-management/upload-resource';
import { UpdateResourceCollectionComponent } from './admin/content-management/update-resource-collection';
import { AdminComponent } from './admin/admin.component';
import {EditReadingResourcesComponent} from './admin/content-management/edit-reading-resources/edit-reading-resources.component';
import {ManageUsersComponent} from './admin/user-management/manage-users/manage-users.component';
import { EndUserComponent } from './end-user/end-user.component';
import { ReadingsComponent } from './end-user/readings';
import { ReadingPracticeComponent } from './end-user/reading-practice';
import { ReadingResourceComponent } from './end-user/reading-resource';

import { LoginComponent } from './authentication/login';
import { SignupComponent } from './authentication/signup';
import { SelfUpdateComponent } from './authentication/self-update';


import {DialogComponent} from './admin/temp/dialog.component';

import { AuthGuard } from './authentication/common/auth.guard';
import {UserService}  from './authentication/user.service';

import {routing} from './app.routes';

@NgModule({
    declarations: [
      AppComponent,
      InputWakeUp,
      TextareaAutoresize,
      ReadingItemComponent,
      ResourceItemComponent,
      PracticeItemComponent,
      EditUserComponent,
      EditUserAnchorDirective,// not sure this needs to be here; needs to be declared in the component anyways....
      UpdatePracticesComponent,
      UpdatePracticeItemComponent,
      UpdateResourcesComponent,
      UpdateResourceItemComponent,
      UploadResourceComponent,
      UpdateResourceCollectionComponent,
      DialogComponent,
      SelfUpdateComponent,
      AdminComponent,
      EditReadingResourcesComponent,
      ManageUsersComponent,
      EndUserComponent,
      ReadingsComponent,
      ReadingPracticeComponent,
      ReadingResourceComponent,
      LoginComponent,
      SignupComponent,
      TruncatePipe,
      PaginatePipe
    ],
    imports: [
      BrowserModule,
      routing,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      HttpModule,
      MaterializeModule,
      DragulaModule,
      MomentModule
    ],
    providers: [AuthGuard, FormBuilder, UserService],
    //NOTE: (1) AuthGuard has been commented out in admin.routes for the moment
    //      (2) I don't know if this is the correct place to put the AuthGuard declaration...in rc4 it was included as part of the bootstrapping process
    entryComponents: [AppComponent, EditUserComponent, DialogComponent],// not sure if EditUserComponent needs to be here....
    bootstrap: [AppComponent]
})
export class AppModule {

}
