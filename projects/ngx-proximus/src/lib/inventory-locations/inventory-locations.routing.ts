import { Routes } from '@angular/router';
import {InventoryLocationsComponent} from './inventory-locations.component';


export const InventoryLocationsRoutes: Routes = [
  {
    path: '',
    component: InventoryLocationsComponent
  },
  {
    path: 'locations/:id',
    component: InventoryLocationsComponent
  },
];
