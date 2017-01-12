import { EndUserComponent } from './end-user.component';

import { ReadingsComponent } from './readings';
import { ReadingPracticeComponent } from './reading-practice';
import { ReadingResourceComponent } from './reading-resource';

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
        //so far, the following is actually readingIndex and practiceIndex (in an array)
        path: 'reading-practice/:dateString/:readingIndex/:practiceIndex',//display the summary for the practice (optionally) and then the Preparation page
        component: ReadingPracticeComponent
      },
      {
        //so far, the following is actually readingIndex and practiceIndex (in an array)
        path: 'reading-practice/:dateString/:readingIndex/:practiceIndex/:stepIndex',//display a step of the practice
        component: ReadingPracticeComponent
      },
      {
        path: 'reading-resource/:readingID/:resourceID',
        component: ReadingResourceComponent
      },
    ]

  },
];
