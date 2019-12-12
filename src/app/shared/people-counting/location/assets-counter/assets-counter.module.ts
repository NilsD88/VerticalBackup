import { MatTableModule, MatSortModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsCounterComponent } from './assets-counter.component';



@NgModule({
  declarations: [AssetsCounterComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  exports: [AssetsCounterComponent]
})
export class AssetsCounterModule { }