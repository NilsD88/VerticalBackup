import { Routes } from '@angular/router';
import { ErrorComponent } from './error.component';

export const ErrorRoutes: Routes = [
  {
    path: '404',
    component: ErrorComponent
  },
  {
    path: '401',
    component: ErrorComponent
  },
  {
    path: '403',
    component: ErrorComponent
  },
  {
    path: '500',
    component: ErrorComponent
  },
];
