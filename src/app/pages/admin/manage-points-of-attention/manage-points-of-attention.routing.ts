import { ManagePointsOfAttentionComponent } from './manage-points-of-attention.component';
import { Routes } from '@angular/router';


export const ManagePointsOfAttentionRoutes: Routes = [
  {
    path: '',
    component: ManagePointsOfAttentionComponent
  },
  {
    path: 'points-of-attention/new',
    loadChildren: () => import('./point-of-attention-wizard/point-of-attention-wizard.module').then(m => m.PointOfAttentionWizardModule)
  },
  {
    path: 'points-of-attention/:id',
    loadChildren: () => import('./point-of-attention-wizard/point-of-attention-wizard.module').then(m => m.PointOfAttentionWizardModule)
  },
];
