import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {MomentModule} from 'angular2-moment';
import {MaterializeModule} from "angular2-materialize";
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {DatePickerModule} from 'ng2-datepicker';
import {MiniCalendarComponent} from './mini-calendar/mini-calendar.component';

import {DashboardComponent} from './dashboard/dashboard.component';
import {DeleteJournalEntryModalComponent} from './delete-journal-entry-modal/delete-journal-entry-modal.component';
import {EndUserComponent} from './end-user.component';
import {GroupPostListComponent} from './group-post-list/group-post-list.component';
import {JournalDashboardComponent} from './journal-dashboard/journal-dashboard.component';
import {JournalEntriesComponent} from './journal-entries/journal-entries.component';
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

export const routes: Routes = [
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
        path: 'dashboard',//dateString can be 'YYYY-MM-DD' or 'today'
        component: DashboardComponent,
        index: true,
      },
      {
        path: 'readings/:dateString',//dateString can be 'YYYY-MM-DD' or 'today'
        component: ReadingsComponent,
        index: true,
      },
      {
        path: 'readings/:dateString/:engageScripture',//engageScripture is a boolean (0 for off, 1 for on)
        component: ReadingsComponent,
        index: true,
      },
      {
        path: 'readings/:dateString/:engageScripture/:readingIndex',//show the specified reading
        component: ReadingsComponent,
        index: true,
      },
      {
        path: 'reading-practice/:dateString/:readingIndex/:practiceIndex',//display the summary for the practice (optionally) and then the Preparation page
        component: ReadingPracticeComponent
      },
      {
        path: 'reading-practice/:dateString/:readingIndex/:practiceIndex/:stepIndex',//display a step of the practice
        component: ReadingPracticeComponent
      },
      {
        path: 'journal',//display journal entries
        component: JournalDashboardComponent
      },
      {
        path: 'journal/search-results',//display journal entries
        component: JournalEntriesSearchResultsComponent
      },
      {
        path: 'journal-entry',//create new journal entry
        component: UpdateJournalEntryComponent
      },
      {
        path: 'journal-entry/:journalEntryID',//update existing journal entry
        component: UpdateJournalEntryComponent
      },
    ]

  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DatePickerModule
    FormsModule,
    MaterializeModule,
    MomentModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    DashboardComponent,
    DeleteJournalEntryModalComponent,
    EndUserComponent,
    GroupPostListComponent,
    JournalDashboardComponent,
    JournalEntriesComponent,
    JournalEntriesSearchResultsComponent,
    JournalEntryItemComponent,
    JournalEntryListComponent,
    MiniCalendarComponent,
    PostItemComponent
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
  ]
})
export class EndUserModule {
}
