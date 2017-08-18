import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterializeModule} from "angular2-materialize";
import {SharedModule} from '../shared/shared.module';

import {NgxPaginationModule} from 'ngx-pagination';
import {MomentModule} from 'angular2-moment';
import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import {FileUploadModule} from 'ng2-file-upload';
import {QuillModule} from 'ngx-quill';

import {EditUserComponent} from './user-management/edit-user/edit-user.component';
import {EditUserModalComponent} from './user-management/edit-user-modal/edit-user-modal.component';

import {AdminComponent} from './admin.component';
import {EditReadingResourcesComponent} from './content-management/edit-reading-resources/edit-reading-resources.component';
import {EditUserAnchorDirective} from './user-management/edit-user-anchor.directive';
import {EditUserModalAnchorDirective} from './user-management/edit-user-modal-anchor.directive';
import {ManageUsersComponent} from './user-management/manage-users/manage-users.component';
import {UpdatePracticeItemComponent} from './content-management/update-practice-item';
import {UpdatePracticesComponent} from './content-management/update-practices';
import {UpdateResourceCollectionComponent} from './content-management/update-resource-collection';
import {UpdateResourceItemComponent} from './content-management/update-resource-item';
import {UpdateResourcesComponent} from './content-management/update-resources';
import {UploadResourceV1Component} from './content-management/upload-resource-v1';
import {UpdateReadingsComponent} from './content-management/update-readings/update-readings.component';
import {UpdateReadingsListComponent} from './content-management/update-readings-list/update-readings-list.component';
import {
  UpdateDirectionAnchorDirective,
  DisplayDirectionStepsComponent
} from './content-management/display-direction-steps/display-direction-steps.component';
import {DisplayReadingModalComponent} from './content-management/display-reading-modal/display-reading-modal.component';
import {
  PassagePickerComponent, VerseRangeComponent,
  PickerAnchorDirective, PassageCommunicationService
} from './content-management/passage-picker/passage-picker.component';
import {BibleInfoService} from "./content-management/bible-info/bible-info.service";
import { UpdateDailyPracticesListComponent } from './content-management/update-daily-practices-list/update-daily-practices-list.component';
import { UpdateReadingDayNameModalComponent } from './content-management/update-reading-day-name-modal/update-reading-day-name-modal.component';
import { ManageGroupsComponent } from './group-management/manage-groups/manage-groups.component';
import { EditGroupModalAnchorDirective } from './group-management/edit-group-modal-anchor.directive';
import { EditGroupModalComponent } from './group-management/edit-group-modal/edit-group-modal.component';
import { EditGroupComponent } from './group-management/edit-group/edit-group.component';
import { UserEntryComponent } from './group-management/user-entry/user-entry.component';
import { UserSelectComponent } from './group-management/user-select/user-select.component';
import { ManageOrganizationsComponent } from './organization-management/manage-organizations/manage-organizations.component';
import { EditOrganizationModalAnchorDirective } from './organization-management/edit-organization-modal-anchor.directive';
import { EditOrganizationModalComponent } from './organization-management/edit-organization-modal/edit-organization-modal.component';
import { EditOrganizationComponent } from './organization-management/edit-organization/edit-organization.component';
import { PassagePickerAnchorDirective, UpdateSingleReadingComponent } from './content-management/update-single-reading/update-single-reading.component';
import { UpdateDirectionFormV1Component } from './content-management/update-direction-form-v1/update-direction-form-v1.component';
import { UpdateDirectionFormComponent } from './content-management/update-direction-form/update-direction-form.component';
import { StepArrayComponent } from './content-management/update-direction-form/step-array.component';
import { StepComponent } from './content-management/update-direction-form/step.component';
import { ResourceArrayComponent } from './content-management/update-direction-form/resource-array.component';
import { ResourceComponent } from './content-management/update-direction-form/resource.component';
import { UploadResourceComponent } from './content-management/upload-resource/upload-resource.component';

import {ByteConversionPipe} from '../shared/pipes/byte-conversion.pipe';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {path: '', redirectTo: 'edit-reading-resources', pathMatch: 'full'},
      {path: 'edit-reading-resources', component: EditReadingResourcesComponent},
      {path: 'manage-users', component: ManageUsersComponent},
      {path: 'manage-groups', component: ManageGroupsComponent},
      {path: 'manage-organizations', component: ManageOrganizationsComponent},
      {
        path: 'update-readings',
        component: UpdateReadingsComponent
      },
      { // go directly to the specified date
        path: 'update-readings/:dateString',
        component: UpdateReadingsComponent
      },
      { // add/edit reading and practices for one specific reading
        path: 'update-readings/:dateString/:readingIndex',
        component: UpdateSingleReadingComponent
      }
    ]
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    EditReadingResourcesComponent,
    EditUserAnchorDirective,
    EditUserModalAnchorDirective,
    EditUserComponent,
    EditUserModalComponent,
    ManageUsersComponent,
    UpdatePracticeItemComponent,
    UpdatePracticesComponent,
    UpdateResourceCollectionComponent,
    UpdateResourceItemComponent,
    UpdateResourcesComponent,
    UploadResourceV1Component,
    UpdateReadingsComponent,
    UpdateReadingsListComponent,
    DisplayDirectionStepsComponent,
    UpdateDirectionAnchorDirective,
    DisplayReadingModalComponent,
    PassagePickerComponent,
    VerseRangeComponent,
    PickerAnchorDirective,
    UpdateDailyPracticesListComponent,
    UpdateReadingDayNameModalComponent,
    ManageGroupsComponent,
    EditGroupModalAnchorDirective,
    EditGroupModalComponent,
    EditGroupComponent,
    UserEntryComponent,
    UserSelectComponent,
    ManageOrganizationsComponent,
    EditOrganizationModalAnchorDirective,
    EditOrganizationModalComponent,
    EditOrganizationComponent,
    UpdateSingleReadingComponent,
    PassagePickerAnchorDirective,
    UpdateDirectionFormV1Component,
    UpdateDirectionFormComponent,
    StepArrayComponent,
    StepComponent,
    ResourceArrayComponent,
    ResourceComponent,
    UploadResourceComponent,
    ByteConversionPipe
  ],
  exports: [
    EditUserComponent
  ],
  entryComponents: [
    EditUserComponent,
    EditUserModalComponent,
    EditGroupModalComponent,
    EditOrganizationModalComponent,
    VerseRangeComponent,
    PassagePickerComponent,
    UpdateDirectionFormV1Component,
    UpdateDirectionFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MaterializeModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPaginationModule,
    MomentModule,
    DragulaModule,
    FileUploadModule,
    QuillModule,
    SharedModule
  ],
  providers: [
    BibleInfoService,
    PassageCommunicationService
  ]
})
export class AdminModule {
}
