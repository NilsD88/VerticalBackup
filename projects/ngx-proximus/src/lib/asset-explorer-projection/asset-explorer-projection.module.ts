import { NgModule } from '@angular/core';
import { AssetExplorerProjectionComponent } from './asset-explorer-projection.component';
import {imports as LocationExplorerImports} from '../location-explorer/location-explorer.module';

@NgModule({
  declarations: [
    AssetExplorerProjectionComponent,
  ],
  imports: [
    ...LocationExplorerImports
  ],
  exports: [
    AssetExplorerProjectionComponent
  ],
})
export class AssetExplorerProjectionModule { }
