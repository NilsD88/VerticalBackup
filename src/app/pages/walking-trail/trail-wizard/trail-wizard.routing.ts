import { Routes } from '@angular/router';

import { TrailWizardComponent } from './trail-wizard.component';

export const TrailWizardRoutes: Routes = [
  {
    path: '',
    component: TrailWizardComponent
  },
  {
    path: ':parentId',
    component: TrailWizardComponent
  }
];
