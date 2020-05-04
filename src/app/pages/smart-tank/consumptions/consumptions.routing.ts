import {Routes} from '@angular/router';
import { ConsumptionsComponent } from './consumptions.component';

export const ConsumptionsRoutes: Routes = [
  {
    path: ':id',
    component: ConsumptionsComponent
  }
];
