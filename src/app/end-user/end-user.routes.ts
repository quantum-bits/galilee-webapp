import { EndUserComponent } from './end-user.component';

import { ReadingsComponent } from './readings/readings.component';
import { ReadingDetailComponent } from './reading-detail/reading-detail.component';

export const EndUserRoutes = [
  {
    path: '/end-user',
    component: EndUserComponent,
    /*
    children: [
      {
        path: '/readings',
        component: ReadingsComponent,
        index: true,
      },
      //{ path: '/readings/:id', component: ReadingDetailComponent },
    ]
    */
  },
];
