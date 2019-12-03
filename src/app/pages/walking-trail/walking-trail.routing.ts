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
    path: 'trail/new',
    loadChildren: () => import('./trail-wizard/trail-wizard.module').then(m => m.TrailWizardModule)
  },
  {
    path: 'trail/update/:id',
    loadChildren: () => import('./trail-wizard/trail-wizard.module').then(m => m.TrailWizardModule)
  },
  {
    path: 'trail/:id',
    children: [{
      path: '',
      loadChildren: () => import('./trail/trail.module').then(m => m.TrailModule)
    }]
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('src/app/pages/walking-trail/detail/detail.module').then(m => m.DetailModule)
  },
  {
    path: 'overview',
    children: [{
      path: '',
      loadChildren: () => import('./lib/inventory-locations/inventory-locations.module').then(m => m.WalkingTrailInventoryLocationsModule)
    }]
  }
];
