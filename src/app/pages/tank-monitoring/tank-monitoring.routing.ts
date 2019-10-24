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
    path: 'consumptions',
    children: [{
      path: '',
      loadChildren: () => import('./consumptions/consumptions.module').then(m => m.ConsumptionsModule)
    }]
  }
];
