import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TrailsBenchmarkComponent } from './trails-benchmark.component';



@NgModule({
  declarations: [TrailsBenchmarkComponent],
  imports: [
    CommonModule,
    LoaderModule
  ],
  providers: [
    DatePipe
  ],
  exports: [TrailsBenchmarkComponent]
})
export class TrailsBenchmarkModule { }
