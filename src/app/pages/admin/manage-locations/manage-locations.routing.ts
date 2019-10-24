import { Routes } from '@angular/router';
import { ManageLocationsComponent } from './manage-locations.component';


export const ManageLocationsRoutes: Routes = [
  {
    path: '',
    component: ManageLocationsComponent
  },
  {
    path: 'new',
    loadChildren: () => import('./location-wizard/location-wizard.module').then(m => m.LocationWizardModule)
  },
  {
    path: 'location/:id',
    loadChildren: () => import('./location-wizard/location-wizard.module').then(m => m.LocationWizardModule)
  },
  {
    path: ':selectedLocationId',
    component: ManageLocationsComponent
  }
];
