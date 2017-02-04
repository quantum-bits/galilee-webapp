import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {MomentModule} from 'angular2-moment';
import {MaterializeModule} from "angular2-materialize";
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {DatePickerModule} from 'ng2-datepicker';
//import {MiniCalendarComponent} from '../shared/components/mini-calendar/mini-calendar.component';

import {AuthGuard} from '../authentication/auth.guard';

import {DashboardComponent} from './dashboard/dashboard.component';
import {DeleteJournalEntryModalComponent} from './delete-journal-entry-modal/delete-journal-entry-modal.component';
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
import {QuestionListComponent} from './question-list/question-list.component';
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

const routes: Routes = [
  {
    path: 'end-user',
    component: EndUserComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
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
        path: 'post-entry',
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
  declarations: [
    DashboardComponent,
    DeleteJournalEntryModalComponent,
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
    QuestionListComponent,
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
    TagPickerComponent
  ]
})
export class EndUserModule {
}
