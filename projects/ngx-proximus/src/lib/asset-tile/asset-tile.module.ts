import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetTileComponent } from './asset-tile.component';



@NgModule({
  declarations: [AssetTileComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [AssetTileComponent]
})
export class AssetTileModule { }
