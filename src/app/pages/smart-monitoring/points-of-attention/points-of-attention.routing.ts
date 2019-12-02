import { PointsOfAttentionComponent } from './points-of-attention.component';
import { Routes } from '@angular/router';


export const PointsOfAttentionRoutes: Routes = [
  {
    path: '',
    component: PointsOfAttentionComponent
  },
  {
    path: 'new',
    loadChildren: () => import('src/app/pages/admin/manage-points-of-attention/point-of-attention-wizard/point-of-attention-wizard.module').then(m => m.PointOfAttentionWizardModule)
  }
];
