import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssetDialogComponent } from './add-asset-dialog.component';



@NgModule({
  declarations: [AddAssetDialogComponent],
  imports: [
    CommonModule,
    LocationExplorerModule
  ],
  exports: [AddAssetDialogComponent]
})
export class AddAssetDialogModule { }
