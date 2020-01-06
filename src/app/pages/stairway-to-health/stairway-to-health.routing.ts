


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
      loadChildren: () => import('./stairway/chart/stairway-count-chart/stairway-count-chart.module').then(m => m.StairwayCountChartModule)
    }]
  },
  
];
