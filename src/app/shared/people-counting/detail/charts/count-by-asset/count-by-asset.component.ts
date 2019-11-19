import {
  Component,
  OnInit,
  OnChanges,
  Input
} from '@angular/core';


import * as Highcharts from 'highcharts';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';

declare global {
  interface Window {
    moment: any;
  }
}

declare var require: any;
require('highcharts/modules/boost');
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
  selector: 'pvf-peoplecounting-count-by-asset',
  templateUrl: './count-by-asset.component.html',
  styleUrls: ['./count-by-asset.component.scss']
})
export class CountByAssetComponent implements OnInit, OnChanges {

  @Input() assets: IPeopleCountingAsset[];

  public chart: any;
  public chartOptions: any;

  constructor() {}

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  ngOnInit() {
    this.initChartOptions();
    this.initChart();
    this.updateChart();
  }

  private initChartOptions() {
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: '300'
      },
      title: {
        text: 'Count by asset'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          },
          innerSize: 100,
          depth: 0
        }

      },
      series: [{
        name: 'Checkpoint',
        colorByPoint: true,
        data: []
      }]
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('count-by-asset-chart-container', this.chartOptions);
    } catch (error) {
      console.log(error);
    }
  }

  private updateChart() {
    this.chartOptions.series[0].data = [];
    if ((this.assets || []).length) {
      const data = [];
      for (const asset of this.assets) {
        data.push({
          name: asset.name,
          y: asset.series.reduce((a, b) => a + b.sum || 0, 0)
        });
      }
      this.chartOptions.series[0].data = data;
    }

    try {
      this.chart = Highcharts.chart('count-by-asset-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series[0].data = [];
      this.chart = Highcharts.chart('count-by-asset-chart-container', this.chartOptions);
      console.log(error);
    }
  }


}
