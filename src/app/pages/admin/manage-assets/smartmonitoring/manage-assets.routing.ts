import {Routes} from '@angular/router';
import {ManageAssetsListComponent} from './manage-assets-list.component';

export const ManageAssetsRoutes: Routes = [
  {
    path: '',
    component: ManageAssetsListComponent
  },
  {
    path: 'new',
    loadChildren: './asset-wizard/asset-wizard.module#AssetWizardModule'
  },
  {
    path: ':id',
    loadChildren: './asset-wizard/asset-wizard.module#AssetWizardModule'
  }
];
