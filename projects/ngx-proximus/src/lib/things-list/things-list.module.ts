import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThingsListComponent} from './things-list.component';
import {MatCheckboxModule, MatTooltipModule} from '@angular/material';
import {ImgFallbackModule} from 'ngx-img-fallback';

@NgModule({
  declarations: [ThingsListComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    ImgFallbackModule,
    MatCheckboxModule
  ],
  exports: [
    ThingsListComponent
  ]
})
export class ThingsListModule {
}
