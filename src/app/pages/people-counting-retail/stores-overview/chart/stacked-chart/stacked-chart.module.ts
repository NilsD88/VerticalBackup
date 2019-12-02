import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackedChartComponent } from './stacked-chart.component';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { WeatherService } from 'src/app/services/weather.service';



@NgModule({
  declarations: [StackedChartComponent],
  imports: [
    CommonModule,
    LoaderModule
  ],
  exports: [StackedChartComponent],
  providers:[
    WeatherService
  ]

  
})
export class StackedChartModule { }
