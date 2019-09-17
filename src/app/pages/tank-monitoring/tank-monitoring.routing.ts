import {Routes} from '@angular/router';

export const TankMonitoringRoutes: Routes = [
  {
    path: 'dashboard',
    children: [{
      path: '',
      loadChildren: './dashboard/dashboard.module#DashboardModule'
    }]
  },
  {
    path: 'consumptions',
    children: [{
      path: '',
      loadChildren: './consumptions/consumptions.module#ConsumptionsModule'
    }]
  }
];
