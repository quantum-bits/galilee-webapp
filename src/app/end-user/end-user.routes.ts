import { EndUserComponent } from './end-user.component';

import { DashboardComponent } from './dashboard';
import { ReadingsComponent } from './readings';
import { ReadingPracticeComponent } from './reading-practice';
import { ReadingResourceComponent } from './reading-resource';
import { JournalDashboardComponent } from './journal-dashboard';
import { JournalEntriesSearchResultsComponent } from './journal-entries-search-results';
import { UpdateJournalEntryComponent } from './update-journal-entry';

export const EndUserRoutes = [
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
      /* DEPRECATED(?)
      {
        path: 'reading-resource/:readingID/:resourceID',
        component: ReadingResourceComponent
      },
      */
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
