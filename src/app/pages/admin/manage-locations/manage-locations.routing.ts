import { Routes } from '@angular/router';
import { ManageLocationsComponent } from './manage-locations.component';


export const ManageLocationsRoutes: Routes = [
  {
    path: '',
    component: ManageLocationsComponent
  },
  {
    path: 'new',
    loadChildren: './location-wizard/location-wizard.module#LocationWizardModule'
  },
  {
    path: 'location/:id',
    loadChildren: './location-wizard/location-wizard.module#LocationWizardModule'
  },
  {
    path: ':selectedLocationId',
    component: ManageLocationsComponent
  }
];
