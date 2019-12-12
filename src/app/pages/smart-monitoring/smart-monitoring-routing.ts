import { Routes } from '@angular/router';

export const SmartMonitoringRoutes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    children: [{
      path: '',
      loadChildren: () => import('projects/ngx-proximus/src/lib/inventory/inventory.module').then(m => m.InventoryModule)
    }]
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('src/app/pages/smart-monitoring/detail/detail.module').then(m => m.DetailModule)
  },
  {
    path: 'points-of-attention',
    loadChildren: () => import('src/app/pages/smart-monitoring/points-of-attention/points-of-attention.module').then(m => m.PointsOfAttentionModule)
  },
  {
    path: 'assets/new',
    loadChildren: () => import('src/app/pages/smart-monitoring/asset-wizard/asset-wizard.module').then(m => m.SmartMonitoringAssetWizardModule)
  },
  {
    path: 'assets/:id',
    loadChildren: () => import('src/app/pages/smart-monitoring/asset-wizard/asset-wizard.module').then(m => m.SmartMonitoringAssetWizardModule)
  }
];
