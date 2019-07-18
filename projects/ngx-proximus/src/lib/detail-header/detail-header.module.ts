import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailHeaderComponent} from './detail-header.component';
import {MatTooltipModule} from '@angular/material';
import {ImgFallbackModule} from 'ngx-img-fallback';

@NgModule({
  declarations: [DetailHeaderComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    ImgFallbackModule
  ],
  exports: [DetailHeaderComponent]
})
export class DetailHeaderModule {
}
