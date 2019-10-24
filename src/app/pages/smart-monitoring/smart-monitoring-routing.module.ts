import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    children: [{
      path: '',
      loadChildren: import('src/app/pages/smart-monitoring/inventory/inventory.module').then(m => m.InventoryModule)
    }]
  },
  {
    path: 'detail/:id',
    loadChildren: import('src/app/pages/smart-monitoring/detail/detail.module').then(m => m.DetailModule)
  },
  {
    path: 'detail2/:id',
    loadChildren: import('src/app/pages/smart-monitoring/detail2/detail2.module').then(m => m.Detail2Module)
  },
  {
    path: 'assets/new',
    loadChildren: import('src/app/pages/smart-monitoring/asset-wizard/asset-wizard.module').then(m => m.SmartMonitoringAssetWizardModule)
  },
  {
    path: 'assets/:id',
    loadChildren: import('src/app/pages/smart-monitoring/asset-wizard/asset-wizard.module').then(m => m.SmartMonitoringAssetWizardModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartMonitoringRoutingModule { }
