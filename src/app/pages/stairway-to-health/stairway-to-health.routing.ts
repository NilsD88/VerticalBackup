

import { Routes } from '@angular/router';

export const StairwayToHealth: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    children: [{
      path: '',
      loadChildren: () => import('./stairway/chart/stairway-pie-chart/stairway-pie-chart.module').then(m => m.StairwayPieChartModule)
    }]
  },
  
];
