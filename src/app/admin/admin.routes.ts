import {AdminComponent} from './admin.component';
import {EditPracticesComponent} from './edit-practices/edit-practices.component';

export const AdminRoutes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: '', redirectTo: 'edit-practices', terminal: true},
      {
        path: 'edit-practices',
        component: EditPracticesComponent,
        index: true,
      },
    ]
  },
];
