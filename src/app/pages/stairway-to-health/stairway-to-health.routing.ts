


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
  {
    path: 'place/new',
    loadChildren: () => import('./place-wizard/place-wizard.module').then(m => m.PlaceWizardModule)
  },
  {
    path: 'place/update/:id',
    loadChildren: () => import('./place-wizard/place-wizard.module').then(m => m.PlaceWizardModule)
  },
  {
    path: 'place/:id',
    children: [{
      path: '',
      loadChildren: () => import('./place/place.module').then(m => m.PlaceModule)
    }]
  },
  {
    path: 'assets/:id',
    children: [{
      path: '',
      loadChildren: () => import('src/app/shared/people-counting/asset-wizard/asset-wizard.module').then(m => m.PeopleCountingAssetWizardModule)
    }]
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('src/app/shared/people-counting/detail/detail.module').then(m => m.PeopleCountingDetailModule)
  },
  {
    path: 'overview',
    children: [{
      path: '',
      loadChildren: () => import('./lib/inventory-locations/inventory-locations.module').then(m => m.StairwayToHealthInventoryLocationsModule)
    }]
  },
];
