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
    path: 'overview',
    children: [{
      path: '',
      loadChildren: () => import('./stores-overview/stores-overview.module').then(m => m.StoresOverviewModule)
    }]
  },
  {
    path: 'store/new',
    children: [{
      path: '',
      loadChildren: () => import('./asset-wizard/asset-wizard.module').then(m => m.AssetWizardModule)
    }]
  }
];
