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
      loadChildren: 'src/app/pages/smart-monitoring/inventory/inventory.module#InventoryModule'
    }]
  },
  {
    path: 'detail/:id',
    loadChildren: 'src/app/pages/smart-monitoring/detail/detail.module#DetailModule'
  },
  {
    path: 'detail2/:id',
    loadChildren: 'src/app/pages/smart-monitoring/detail2/detail2.module#Detail2Module'
  },
  {
    path: 'assets/new',
    loadChildren: 'src/app/pages/smart-monitoring/asset-wizard/asset-wizard.module#SmartMonitoringAssetWizardModule'
  },
  {
    path: 'assets/:id',
    loadChildren: 'src/app/pages/smart-monitoring/asset-wizard/asset-wizard.module#SmartMonitoringAssetWizardModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartMonitoringRoutingModule { }
