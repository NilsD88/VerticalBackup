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
      loadChildren: './inventory/inventory.module#InventoryModule'
    }]
  },
  {
    path: 'detail/:id',
    loadChildren: './detail/detail.module#DetailModule'
  },
  {
    path: 'detail2/:id',
    loadChildren: './detail2/detail2.module#Detail2Module'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartMonitoringRoutingModule { }
