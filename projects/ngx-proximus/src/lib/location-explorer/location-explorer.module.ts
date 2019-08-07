import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationExplorerComponent } from './location-explorer.component';
import { MatTabsModule, MatListModule } from '@angular/material';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [LocationExplorerComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatListModule,
    IconModule
  ],
  exports: [
    LocationExplorerComponent
  ]
})
export class LocationExplorerModule { }
