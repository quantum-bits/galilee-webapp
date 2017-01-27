import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterializeModule} from "angular2-materialize";
import {SharedModule} from '../shared/shared.module';
import {Ng2PaginationModule} from 'ng2-pagination';
import {MomentModule} from 'angular2-moment';
import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import {FileUploadModule} from 'ng2-file-upload';

import {EditUserComponent} from './user-management/edit-user/edit-user.component';

import {AdminComponent} from './admin.component';
import {EditReadingResourcesComponent} from './content-management/edit-reading-resources/edit-reading-resources.component';
import {EditUserAnchorDirective} from './user-management/edit-user-anchor.directive';
import {ManageUsersComponent} from './user-management/manage-users/manage-users.component';
import {UpdatePracticeItemComponent} from './content-management/update-practice-item';
import {UpdatePracticesComponent} from './content-management/update-practices';
import {UpdateResourceCollectionComponent} from './content-management/update-resource-collection';
import {UpdateResourceItemComponent} from './content-management/update-resource-item';
import {UpdateResourcesComponent} from './content-management/update-resources';
import {UploadResourceComponent} from './content-management/upload-resource';
import {ManageReadingComponent} from './content-management/manage-reading/manage-reading.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: '', redirectTo: 'edit-reading-resources', pathMatch: 'full'},
      {path: 'edit-reading-resources', component: EditReadingResourcesComponent},
      {path: 'manage-users', component: ManageUsersComponent},
      {path: 'manage-readings', component: ManageReadingComponent}
    ]
  },
];


@NgModule({
  declarations: [
    AdminComponent,
    EditReadingResourcesComponent,
    EditUserAnchorDirective,
    EditUserComponent,
    ManageUsersComponent,
    UpdatePracticeItemComponent,
    UpdatePracticesComponent,
    UpdateResourceCollectionComponent,
    UpdateResourceItemComponent,
    UpdateResourcesComponent,
    UploadResourceComponent,
    ManageReadingComponent
  ],
  exports: [
    EditUserComponent
  ],
  entryComponents: [
    EditUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MaterializeModule,
    ReactiveFormsModule,
    RouterModule,
    Ng2PaginationModule,
    MomentModule,
    DragulaModule,
    FileUploadModule,
    SharedModule
  ],
})
export class AdminModule {
}
