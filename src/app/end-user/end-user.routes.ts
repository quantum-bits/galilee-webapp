import { EndUserComponent } from './end-user.component';

import { ReadingsComponent } from './readings';
import { ReadingDetailComponent } from './reading-detail';

export const EndUserRoutes = [
  {
    path: 'end-user',
    component: EndUserComponent,
    children: [
      { path: '', redirectTo: 'readings', terminal: true },
      {
        path: 'readings',
        component: ReadingsComponent,
        index: true,
      },
      { path: 'reading-detail/:readingID/:practiceID', component: ReadingDetailComponent },
    ]

  },
];
