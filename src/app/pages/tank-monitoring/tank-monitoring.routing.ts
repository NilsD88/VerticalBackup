import {Routes} from '@angular/router';

export const TankMonitoringRoutes: Routes = [
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
    path: 'inventory',
    children: [{
      path: '',
      loadChildren: () => import('./lib/inventory/inventory.module').then(m => m.TankMonitoringInventoryModule)
    }]
  },
  {
    path: 'consumptions',
    children: [{
      path: '',
      loadChildren: () => import('./consumptions/consumptions.module').then(m => m.ConsumptionsModule)
    }]
  },
  {
    path: 'assets/new',
    loadChildren: () => import('src/app/pages/tank-monitoring/asset-wizard/asset-wizard.module').then(m => m.TankMonitoringAssetWizardModule)
  },
  {
    path: 'assets/:id',
    loadChildren: () => import('src/app/pages/tank-monitoring/asset-wizard/asset-wizard.module').then(m => m.TankMonitoringAssetWizardModule)
  }
];
