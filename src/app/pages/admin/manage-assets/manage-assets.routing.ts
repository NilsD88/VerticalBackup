import {Routes} from '@angular/router';
import {ManageAssetsListComponent} from './manage-assets-list.component';

export const ManageAssetsRoutes: Routes = [
  {
    path: '',
    component: ManageAssetsListComponent
  },
  {
    path: 'new',
    loadChildren: () => import('src/app/pages/admin/manage-assets/asset-wizard/asset-wizard.module').then(m => m.AssetWizardModule)
  },
  {
    path: ':id',
    loadChildren: () => import('src/app/pages/admin/manage-assets/asset-wizard/asset-wizard.module').then(m => m.AssetWizardModule)
  }
];
