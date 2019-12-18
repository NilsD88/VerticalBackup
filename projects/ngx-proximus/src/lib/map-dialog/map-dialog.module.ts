import { IconModule } from './../icon/icon.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapDialogComponent } from './map-dialog.component';



@NgModule({
  declarations: [MapDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    IconModule
  ],
  exports: [MapDialogComponent]
})
export class MapDialogModule { }
