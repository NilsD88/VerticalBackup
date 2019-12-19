import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountByAssetComponent } from './count-by-asset.component';



@NgModule({
  declarations: [CountByAssetComponent],
  imports: [
    CommonModule,
    LoaderModule
  ],
  exports: [CountByAssetComponent]
})
export class CountByAssetModule { }
