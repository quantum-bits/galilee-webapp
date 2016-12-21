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
        redirectTo: 'readings',
        pathMatch: 'full'
      },
      {
        path: 'readings',
        component: ReadingsComponent,
        index: true,
      },
      {
        path: 'reading-practice/:readingID/:practiceID',
        component: ReadingPracticeComponent
      },
      {
        path: 'reading-resource/:readingID/:resourceID',
        component: ReadingResourceComponent
      },
    ]

  },
];
