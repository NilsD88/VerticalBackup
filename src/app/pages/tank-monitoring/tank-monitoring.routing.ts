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
      loadChildren: './dashboard/dashboard.module#DashboardModule'
    }]
  },
  {
    path: 'consumptions/:id',
    children: [{
      path: '',
      loadChildren: './consumptions/consumptions.module#ConsumptionsModule'
    }]
  }
];
