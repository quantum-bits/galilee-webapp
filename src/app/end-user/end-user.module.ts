import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {MomentModule} from 'angular2-moment';
import {MaterializeModule} from "angular2-materialize";
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {DatePickerModule} from 'ng2-datepicker';
//import {MiniCalendarComponent} from '../shared/components/mini-calendar/mini-calendar.component';

import {AuthGuard} from '../authentication/auth.guard';

//import {DashboardComponent} from './dashboard/dashboard.component';
import {EndUserComponent} from './end-user.component';
import {GroupPostListComponent} from './group-post-list/group-post-list.component';
import {JournalDashboardComponent} from './journal-dashboard/journal-dashboard.component';
import {JournalEntriesSearchResultsComponent} from './journal-entries-search-results/journal-entries-search-results.component';
import {JournalEntryItemComponent} from './journal-entry-item/journal-entry-item.component';
import {JournalEntryListComponent} from './journal-entry-list/journal-entry-list.component';
import {PostItemComponent} from './post-item/post-item.component';
import {PracticeItemComponent} from './practice-item';
import {PracticeListComponent} from './practice-list/practice-list.component';
import {PracticePreparationComponent} from './practice-preparation/practice-preparation.component';
import {PracticeStepComponent} from './practice-step/practice-step.component';
import {PracticeSummaryComponent} from './practice-summary/practice-summary.component';
import {ReadingItemComponent} from './reading-item';
import {ReadingPracticeComponent} from './reading-practice';
import {ReadingResourceComponent} from './reading-resource';
import {ReadingsComponent} from './readings';
import {ReadingsListComponent} from './readings-list/readings-list.component';
import {ResourceItemComponent} from './resource-item';
import {SharedModule} from '../shared/shared.module';
import {SimpleModalComponent} from './readings/simple-modal.component';
import {TruncatePipe} from '../shared/pipes/truncate.pipe';
import {UpdateJournalEntryComponent} from './update-journal-entry/update-journal-entry.component';
import {UpdatePostComponent} from './update-post/update-post.component';
import {PostDashboardComponent} from './post-dashboard/post-dashboard.component';
import {InfoGalileeComponent} from './info-galilee/info-galilee.component';
import {InfoRCLComponent} from './info-rcl/info-rcl.component';
import {TagPickerComponent} from './tag-picker/tag-picker.component';
import { DailyPracticeComponent } from './daily-practice/daily-practice.component';
import { DateNavComponent } from './date-nav/date-nav.component';
import { HelpCreateAccountComponent } from './help-create-account/help-create-account.component';
import { HelpHowForumComponent } from './help-how-forum/help-how-forum.component';
import { HelpHowJournalComponent } from './help-how-journal/help-how-journal.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceItemModalComponent } from './resource-item-modal/resource-item-modal.component';
import { ResourceModalAnchorDirective } from './resource-list/resource-modal-anchor.directive';
import { ImageItemComponent } from './image-item/image-item.component';
import { ResourceItemMetadataModalComponent } from './resource-item-metadata-modal/resource-item-metadata-modal.component';

const routes: Routes = [
  {
    path: 'end-user',
    component: EndUserComponent,
    children: [
      {
        path: '',
        redirectTo: 'readings/today',
        pathMatch: 'full'
      },
      {
        // dateString can be 'YYYY-MM-DD' or 'today'
        path: 'readings/:dateString',
        component: ReadingsComponent,
      },
      {
        // Show the specified reading
        path: 'readings/:dateString/:readingIndex',
        component: ReadingsComponent,
      },
      {
        //display the summary for the practice (optionally) and then the Preparation page
        path: 'reading-practice/:dateString/:readingIndex/:practiceIndex',
        component: ReadingPracticeComponent
      },
      {
        //display a step of the practice
        path: 'reading-practice/:dateString/:readingIndex/:practiceIndex/:stepIndex',
        component: ReadingPracticeComponent
      },
      {
        //display journal entries
        path: 'journal',
        component: JournalDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        //display journal entries
        path: 'journal/search-results',
        component: JournalEntriesSearchResultsComponent,
        canActivate: [AuthGuard]
      },
      {
        //create new journal entry
        path: 'journal-entry',
        component: UpdateJournalEntryComponent,
        canActivate: [AuthGuard]
      },
      {
        //update existing journal entry
        path: 'journal-entry/:journalEntryID',
        component: UpdateJournalEntryComponent,
        canActivate: [AuthGuard]
      },
      {
        //display posts
        path: 'post',
        component: PostDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        //create new forum post
        path: 'post-entry/create/:groupId',
        component: UpdatePostComponent,
        canActivate: [AuthGuard]
      },
      {
        //update existing forum post
        path: 'post-entry/update/:postId',
        component: UpdatePostComponent,
        canActivate: [AuthGuard]
      },
      {
        //static info page about the galilee project
        path: 'info-galilee',
        component: InfoGalileeComponent
      },
      {
        //static info page about the rcl
        path: 'info-rcl',
        component: InfoRCLComponent
      },
      {
        //static help page account-creation
        path: 'help-create-account',
        component: HelpCreateAccountComponent
      },
      {
        //static help page how-forum
        path: 'help-how-forum',
        component: HelpHowForumComponent
      },
      {
        //static help page how-journal
        path: 'help-how-journal',
        component: HelpHowJournalComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DatePickerModule,
    FormsModule,
    MaterializeModule,
    MomentModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [
    ResourceItemModalComponent,
    ResourceItemMetadataModalComponent
  ],
  declarations: [
    //DashboardComponent,
    EndUserComponent,
    GroupPostListComponent,
    JournalDashboardComponent,
    JournalEntriesSearchResultsComponent,
    JournalEntryItemComponent,
    JournalEntryListComponent,
    //MiniCalendarComponent,
    PostItemComponent,
    PracticeItemComponent,
    PracticeListComponent,
    PracticePreparationComponent,
    PracticeStepComponent,
    PracticeSummaryComponent,
    ReadingItemComponent,
    ReadingPracticeComponent,
    ReadingResourceComponent,
    ReadingsComponent,
    ReadingsListComponent,
    ResourceItemComponent,
    SimpleModalComponent,
    TruncatePipe,
    UpdateJournalEntryComponent,
    UpdatePostComponent,
    PostDashboardComponent,
    InfoGalileeComponent,
    InfoRCLComponent,
    TagPickerComponent,
    DailyPracticeComponent,
    DateNavComponent,
    HelpCreateAccountComponent,
    HelpHowForumComponent,
    HelpHowJournalComponent,
    ResourceListComponent,
    ResourceItemModalComponent,
    ResourceModalAnchorDirective,
    ImageItemComponent,
    ResourceItemMetadataModalComponent
  ]
})
export class EndUserModule {
}
