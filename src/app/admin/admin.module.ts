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
import {UpdateReadingsComponent} from './content-management/update-readings/update-readings.component';
import {UpdateReadingsListComponent} from './content-management/update-readings-list/update-readings-list.component';
import {UpdateQuestionsListComponent} from './content-management/update-questions-list/update-questions-list.component';
import {UpdateReadingFormComponent} from './content-management/update-reading-form/update-reading-form.component';
import {UpdateQuestionFormComponent} from './content-management/update-question-form/update-question-form.component';
import {UpdatePracticeFormComponent} from './content-management/update-practice-form/update-practice-form.component';
import {DisplayApplicationStepsComponent} from './content-management/display-application-steps/display-application-steps.component';
import {DisplayReadingModalComponent} from './content-management/display-reading-modal/display-reading-modal.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: '', redirectTo: 'edit-reading-resources', pathMatch: 'full'},
      {path: 'edit-reading-resources', component: EditReadingResourcesComponent},
      {path: 'manage-users', component: ManageUsersComponent},
      {
        path: 'update-readings',
        component: UpdateReadingsComponent
      },
      { // go directly to the specified date
        path: 'update-readings/:dateString',
        component: UpdateReadingsComponent
      },
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
    ManageReadingComponent,
    UpdateReadingsComponent,
    UpdateReadingsListComponent,
    UpdateQuestionsListComponent,
    UpdateReadingFormComponent,
    UpdateQuestionFormComponent,
    UpdatePracticeFormComponent,
    DisplayApplicationStepsComponent,
    DisplayReadingModalComponent
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
