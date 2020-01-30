import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssetDialogComponent } from './add-asset-dialog.component';
import { AssetExplorerModule } from '../../../asset-explorer/asset-explorer.module';



@NgModule({
  declarations: [AddAssetDialogComponent],
  imports: [
    CommonModule,
    AssetExplorerModule
  ],
  exports: [AddAssetDialogComponent]
})
export class AddAssetDialogModule { }
