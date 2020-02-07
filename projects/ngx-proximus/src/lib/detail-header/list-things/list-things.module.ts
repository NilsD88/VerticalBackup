import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListThingsComponent } from './list-things.component';
import { ImgFallbackModule } from 'ngx-img-fallback';



@NgModule({
  declarations: [ListThingsComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    ImgFallbackModule,
    NgxSkeletonLoaderModule
  ],
  exports: [ListThingsComponent]
})
export class DetailHeaderListThingsModule { }
