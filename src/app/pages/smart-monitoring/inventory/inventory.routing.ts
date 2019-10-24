import { Routes } from '@angular/router';
import {InventoryComponent} from './inventory.component';


export const InventoryRoutes: Routes = [
  {
    path: '',
    component: InventoryComponent
  },
  {
    path: 'locations/:id',
    component: InventoryComponent
  },
];
