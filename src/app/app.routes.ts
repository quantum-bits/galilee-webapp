import { provideRouter, RouterConfig } from '@angular/router';

import { EndUserRoutes } from './end-user/end-user.routes';
import { ReadingsComponent } from './end-user/readings/readings.component';
import { ReadingDetailComponent } from './end-user/reading-detail/reading-detail.component';

const routes: RouterConfig = [
  {
    path: '/readings',
    component: ReadingsComponent,
    index: true,
  },
  {
    path: '/reading-detail',
    component: ReadingDetailComponent,
  },
//  ...EndUserRoutes,
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
