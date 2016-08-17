import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ApplicationRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';

import {PaginationControlsCmp} from 'ng2-pagination';
import {MaterializeDirective} from 'angular2-materialize';
import {Dragula} from 'ng2-dragula/ng2-dragula';
import {FILE_UPLOAD_DIRECTIVES} from 'ng2-file-upload';

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


import { AuthGuard } from './authentication/common/auth.guard';

import {routing} from './app.routes';

//import "angular2-materialize";

@NgModule({
    declarations: [
      AppComponent,
      MaterializeDirective,
      PaginationControlsCmp,
      Dragula,
      FILE_UPLOAD_DIRECTIVES,
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
      UpdateResourceCollectionComponent
    ],
    imports: [
      BrowserModule,
      routing,
      CommonModule,
      FormsModule,
      HttpModule
    ],
    providers: [AuthGuard],
    //NOTE: (1) AuthGuard has been commented out in admin.routes for the moment
    //      (2) I don't know if this is the correct place to put the AuthGuard declaration...in rc4 it was included as part of the bootstrapping process
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {

}
