import { provideRouter, RouterConfig } from '@angular/router';

import { EndUserRoutes } from './end-user/end-user.routes';
import { ReadingsComponent } from './end-user/readings/readings.component';
import { ReadingDetailComponent } from './end-user/reading-detail/reading-detail.component';
import { AdminComponent } from './admin/admin.component';


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
  {
    path: '/admin',
    component: AdminComponent,
  },

//  ...EndUserRoutes,
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
