import { NgModule } from '@angular/core';
import { PointOfAttentionExplorerProjectionComponent } from './point-of-attention-explorer-projection.component';
import { imports as LocationExplorerImports} from '../location-explorer/location-explorer.module';

@NgModule({
  declarations: [
    PointOfAttentionExplorerProjectionComponent,
  ],
  imports: [
    ...LocationExplorerImports
  ],
  exports: [
    PointOfAttentionExplorerProjectionComponent
  ],
})
export class PointOfAttentionExplorerProjectionModule { }
