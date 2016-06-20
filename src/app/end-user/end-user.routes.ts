import { EndUserComponent } from './end-user.component';

import { ReadingsComponent } from './readings';
import { ReadingDetailComponent } from './reading-detail';

export const EndUserRoutes = [
  {
    path: '/end-user',
    component: EndUserComponent,
    index: true,
    children: [
      {
        path: '/readings',
        component: ReadingsComponent,
        index: true,
      },
      { path: '/reading-detail/:id', component: ReadingDetailComponent },
    ]

  },
];
