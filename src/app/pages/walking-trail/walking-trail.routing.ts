import {Routes} from '@angular/router';

export const WalkingTrailRoutes: Routes = [
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
    path: 'trail/:id',
    children: [{
      path: '',
      loadChildren: () => import('./trail/trail.module').then(m => m.TrailModule)
    }]
  },
  {
    path: 'inventory',
    children: [{
      path: '',
      loadChildren: () => import('projects/ngx-proximus/src/lib/inventory-locations/inventory-locations.module').then(m => m.InventoryLocationsModule)
    }]
  },
];
