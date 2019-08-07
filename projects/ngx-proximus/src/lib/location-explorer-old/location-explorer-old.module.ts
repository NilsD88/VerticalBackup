import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationExplorerOldComponent } from './location-explorer-old.component';
import { MatTabsModule, MatListModule } from '@angular/material';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [LocationExplorerOldComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatListModule,
    IconModule
  ],
  exports: [
    LocationExplorerOldComponent
  ]
})
export class LocationExplorerOldModule { }
