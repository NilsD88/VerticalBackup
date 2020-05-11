import {Routes} from '@angular/router';

export const SmartCountingRoutes: Routes = [
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
    path: 'store/new',
    loadChildren: () => import('./store-wizard/store-wizard.module').then(m => m.StoreWizardModule)
  },
  {
    path: 'store/update/:id',
    loadChildren: () => import('./store-wizard/store-wizard.module').then(m => m.StoreWizardModule)
  },
  {
    path: 'store/:id',
    children: [{
      path: '',
      loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
    }]
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('src/app/shared/people-counting/detail/detail.module').then(m => m.PeopleCountingDetailModule)
  },
  {
    path: 'overview',
    children: [{
      path: '',
      loadChildren: () => import('./lib/inventory-locations/inventory-locations.module').then(m => m.SmartCountingInventoryLocationsModule)
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
