import {Routes} from '@angular/router';
import {ManageAssetsComponent} from './manage-assets.component';
import {ManageAssetsListComponent} from './manage-assets-list.component';
import { PublicLayoutComponent } from 'src/app/layout/smartmonitoring/public.layout.component';


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
  /*
  {
    path: ':id',
    component: ManageAssetsComponent
  }
  */
];
