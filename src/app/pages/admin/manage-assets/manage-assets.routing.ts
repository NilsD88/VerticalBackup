import {Routes} from '@angular/router';
import {ManageAssetsListComponent} from './manage-assets-list.component';

export const ManageAssetsRoutes: Routes = [
  {
    path: '',
    component: ManageAssetsListComponent
  },
  {
    path: 'new',
    loadChildren: 'src/app/pages/admin/manage-assets/asset-wizard/asset-wizard.module#AssetWizardModule'
  },
  {
    path: ':id',
    loadChildren: 'src/app/pages/admin/manage-assets/asset-wizard/asset-wizard.module#AssetWizardModule'
  }
];
