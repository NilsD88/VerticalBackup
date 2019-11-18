import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationTileComponent } from './location-tile.component';



@NgModule({
  declarations: [LocationTileComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [LocationTileComponent]
})
export class LocationTileModule { }
