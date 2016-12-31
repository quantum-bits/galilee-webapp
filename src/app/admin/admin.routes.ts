import {AdminComponent} from './admin.component';
import {EditReadingResourcesComponent} from './content-management/edit-reading-resources/edit-reading-resources.component';
import {ManageUsersComponent} from './user-management/manage-users/manage-users.component';

import {ManageReadingComponent} from "./content-management/manage-reading/manage-reading.component";

export const AdminRoutes = [
  {
    path: 'admin',
    component: AdminComponent,
    //canActivate: [AuthGuard],
    children:[
      {
        path: '',
        redirectTo: 'edit-reading-resources',
        pathMatch: 'full'
      },
      {
        path: 'edit-reading-resources',
        component: EditReadingResourcesComponent,
        index: true
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        index: true
      },
      {
        path: 'manage-readings',
        component: ManageReadingComponent,
        index: true
      }
    ]
  },
];
