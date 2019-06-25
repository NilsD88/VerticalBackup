import {Routes} from '@angular/router';
import {ManageAssetsComponent} from './manage-assets.component';
import {ManageAssetsListComponent} from './manage-assets-list.component';


export const ManageAssetsRoutes: Routes = [{
  path: '',
  component: ManageAssetsListComponent
}, {
  path: ':id',
  component: ManageAssetsComponent
}];
