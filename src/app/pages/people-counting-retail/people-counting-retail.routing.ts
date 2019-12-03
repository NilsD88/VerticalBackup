import {Routes} from '@angular/router';

export const PeopleCountingRetailRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    children: [{
      path: '',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    }]
  },
  {
    path: 'store/:id',
    children: [{
      path: '',
      loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
    }]
  },
  {
    path: 'overview',
    children: [{
      path: '',
      loadChildren: () => import('./lib/inventory-locations/inventory-locations.module').then(m => m.PeopleCountingRetailInventoryLocationsModule)
    }]
  },
  {
    path: 'assets/:id',
    children: [{
      path: '',
      loadChildren: () => import('src/app/shared/people-counting/asset-wizard/asset-wizard.module').then(m => m.PeopleCountingAssetWizardModule)
    }]
  },
];
