import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationExplorerComponent } from './location-explorer.component';
import { MatTabsModule, MatListModule } from '@angular/material';

@NgModule({
  declarations: [LocationExplorerComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatListModule
  ],
  exports: [
    LocationExplorerComponent
  ]
})
export class LocationExplorerModule { }
