import {Routes} from '@angular/router';
import {ManageThresholdTemplatesComponent} from './manage-threshold-templates.component';
import {ManageThresholdTemplatesListComponent} from './manage-threshold-templates-list.component';


export const ManageThresholdTemplatesRoutes: Routes = [{
  path: '',
  component: ManageThresholdTemplatesListComponent
}, {
  path: ':id',
  component: ManageThresholdTemplatesComponent
}];
