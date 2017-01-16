import { EndUserComponent } from './end-user.component';
import { ReadingsComponent } from './readings';
import { ReadingPracticeComponent } from './reading-practice';
import { ReadingResourceComponent } from './reading-resource';
import { JournalEntriesComponent } from './journal-entries';
import { AuthGuard } from '../authentication/auth.guard';

export const EndUserRoutes = [
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
        path: 'readings/:dateString',//dateString can be 'YYYY-MM-DD' or 'today'
        component: ReadingsComponent,
        index: true,
      },
      {
        path: 'readings/:dateString/:engageScripture',//engageScripture is a boolean (0 for off)
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
        // Display journal entries
        path: 'journal-entries',
        component: JournalEntriesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'reading-resource/:readingID/:resourceID',
        component: ReadingResourceComponent
      },
    ]

  },
];
