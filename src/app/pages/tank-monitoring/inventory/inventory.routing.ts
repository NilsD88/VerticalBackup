import { Routes } from '@angular/router';
import {TankMonitoringInventoryComponent} from './inventory.component';


export const InventoryRoutes: Routes = [
  {
    path: '',
    component: TankMonitoringInventoryComponent
  },
  {
    path: 'locations/:id',
    component: TankMonitoringInventoryComponent
  },
];
