import { Routes } from '@angular/router';

import { PlaceWizardComponent } from './place-wizard.component';

export const PlaceWizardRoutes: Routes = [
  {
    path: '',
    component: PlaceWizardComponent
  },
  {
    path: ':parentId',
    component: PlaceWizardComponent
  }
];
