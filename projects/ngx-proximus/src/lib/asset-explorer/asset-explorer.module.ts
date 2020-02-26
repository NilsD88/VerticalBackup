import { TranslateModule } from '@ngx-translate/core';
import { AssetExplorerProjectionModule } from './../asset-explorer-projection/asset-explorer-projection.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetExplorerComponent } from './asset-explorer.component';
import { IconModule } from '../icon/icon.module';
import { MatProgressSpinnerModule } from '@angular/material';
@NgModule({
  declarations: [
    AssetExplorerComponent,
  ],
  imports: [
    CommonModule,
    AssetExplorerProjectionModule,
    MatProgressSpinnerModule,
    IconModule,
    TranslateModule
  ],
  exports: [
    AssetExplorerComponent
  ],
})
export class AssetExplorerModule { }
