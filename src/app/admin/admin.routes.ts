import {AdminComponent} from './admin.component';
import {EditReadingResourcesComponent} from './edit-reading-resources/edit-reading-resources.component';

export const AdminRoutes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: '', redirectTo: 'edit-reading-resources', terminal: true},
      {
        path: 'edit-reading-resources',
        component: EditReadingResourcesComponent,
        index: true,
      },
    ]
  },
];
