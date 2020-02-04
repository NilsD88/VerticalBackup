import { PointOfAttentionExplorerProjectionModule } from './../point-of-attention-explorer-projection/point-of-attention-explorer-projection.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfAttentionExplorerComponent } from './point-of-attention-explorer.component';
import { IconModule } from '../icon/icon.module';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  declarations: [
    PointOfAttentionExplorerComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    IconModule,
    PointOfAttentionExplorerProjectionModule,
  ],
  exports: [
    PointOfAttentionExplorerComponent
  ],
})
export class PointOfAttentionExplorerModule { }
