import { PointsOfAttentionComponent } from './points-of-attention.component';
import { Routes } from '@angular/router';


export const PointsOfAttentionRoutes: Routes = [
  {
    path: '',
    component: PointsOfAttentionComponent
  },
  {
    path: 'point-of-attention',
    loadChildren: () => import('./point-of-attention/point-of-attention.module').then(m => m.PointOfAttentionModule)
  }
];
