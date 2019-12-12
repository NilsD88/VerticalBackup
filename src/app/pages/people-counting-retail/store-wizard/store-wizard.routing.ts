import { Routes } from '@angular/router';

import { StoreWizardComponent } from './store-wizard.component';

export const StoreWizardRoutes: Routes = [
  {
    path: '',
    component: StoreWizardComponent
  },
  {
    path: ':parentId',
    component: StoreWizardComponent
  }
];
