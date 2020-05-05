import { Routes } from '@angular/router';
import {SmartTankInventoryComponent} from './inventory.component';


export const InventoryRoutes: Routes = [
  {
    path: '',
    component: SmartTankInventoryComponent
  },
  {
    path: 'locations/:id',
    component: SmartTankInventoryComponent
  },
];
