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
      loadChildren: () => import('./inventory/inventory.module').then(m => m.TankMonitoringInventoryModule)
    }]
  },
  {
    path: 'consumptions',
    children: [{
      path: '',
      loadChildren: () => import('./consumptions/consumptions.module').then(m => m.ConsumptionsModule)
    }]
  }
];
