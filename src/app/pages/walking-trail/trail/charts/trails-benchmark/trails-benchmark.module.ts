import { DataErrorModule } from './../../../../../../../projects/ngx-proximus/src/lib/data-error/data-error.module';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TrailsBenchmarkComponent } from './trails-benchmark.component';



@NgModule({
  declarations: [TrailsBenchmarkComponent],
  imports: [
    CommonModule,
    LoaderModule,
    DataErrorModule
  ],
  providers: [
    DatePipe
  ],
  exports: [TrailsBenchmarkComponent]
})
export class TrailsBenchmarkModule { }
