import { PointOfAttentionComponent } from './point-of-attention.component';
import { Routes } from '@angular/router';


export const PointOfAttentionRoutes: Routes = [
  {
    path: 'new',
    loadChildren: () => import('src/app/pages/admin/manage-points-of-attention/point-of-attention-wizard/point-of-attention-wizard.module').then(m => m.PointOfAttentionWizardModule)
  },
  {
    path: ':id',
    component: PointOfAttentionComponent
  }
];
