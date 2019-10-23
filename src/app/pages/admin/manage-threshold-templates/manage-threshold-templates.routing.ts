import {Routes} from '@angular/router';
import {ManageThresholdTemplatesComponent} from './manage-threshold-templates.component';
import {ManageThresholdTemplatesListComponent} from './manage-threshold-templates-list.component';


export const ManageThresholdTemplatesRoutes: Routes = [
  {
    path: '',
    component: ManageThresholdTemplatesListComponent
  },
  {
    path: 'new',
    component: ManageThresholdTemplatesComponent
  },
  {
    path: ':id',
    component: ManageThresholdTemplatesComponent
  }
];
