import { Router } from '@angular/router';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
import {
  Component,
  OnInit,
  OnChanges,
  Input
} from '@angular/core';


import * as Highcharts from 'highcharts';
import { IPeopleCountingAsset, IPeopleCountingAssetSerie } from 'src/app/models/peoplecounting/asset.model';
import * as moment from 'moment';
import * as randomColor from 'randomcolor';

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

  @Input() leaf: IPeopleCountingLocation;
  @Input() assets: IPeopleCountingAsset[];
  @Input() assetUrl: string;
  @Input() assetService: WalkingTrailAssetService;
  @Input() assetColors: string[];

  public chart: any;
  public chartOptions: any;

  constructor(
    private router: Router
  ) {}

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  async ngOnInit() {
    if (!this.assets) {
      this.assets = await this.assetService.getAssetsByLocationId(this.leaf.id).toPromise();
    }
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
      },
      title: {
        text: 'Count by asset'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      credits: {
        enabled: false
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
        },
        series: {
          point: {
            events: {
              click: (event) => {
                this.router.navigateByUrl(`${this.assetUrl}${event.point.id}`);
              }
            }
          }
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

  private async updateChart() {
    if ((this.assets || []).length) {
      const data = [];
      const assetColors = this.assetColors || randomColor({
        count: this.assets.length
      });
      const assets = await this.assetService.getAssetsDataByIds(
        this.assets.map(asset => asset.id),
        'DAILY',
        moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
        moment().valueOf(),
      ).toPromise();
      assets.forEach((asset, assetIndex) => {
        const series = asset.series || [];
        data.push({
          id: asset.id,
          name: asset.name,
          color: assetColors[assetIndex],
          y: (series.length) ? asset.series[0].valueIn : null,
        });
      });
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

function generateTodayDataSeries(): IPeopleCountingAssetSerie[] {
  const dataSeries: IPeopleCountingAssetSerie[] = [];
  dataSeries.push(
    {
      timestamp: moment().startOf('day').valueOf(),
      valueIn: Math.floor(Math.random() * 101)
    }
  );
  return dataSeries;
}

