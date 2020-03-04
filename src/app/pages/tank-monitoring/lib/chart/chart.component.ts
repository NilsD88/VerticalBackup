import { PeriodicDuration } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import {Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { IAsset } from 'src/app/models/asset.model';
import { isNullOrUndefined } from 'util';
import { HIGHCHARTS_MENU_ITEMS } from 'src/app/shared/global';


declare global {
  interface Window { moment: any; }
}

moment.locale('nl-be');
window.moment = moment;
mTZ();

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const exporting = require('highcharts/modules/exporting');
const exportData = require('highcharts/modules/export-data');
const Highcharts = require('highcharts/highstock');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);


interface IFilterChartData {
  interval?: string;
  from?: number;
  to?: number;
  durationInHours?: number;
}

interface IChartData {
  label: string;
  series: IChartSerie[];
}

interface IChartSerie {
  timestamp: number;
  avg?: number;
  min?: number;
  max?: number;
  sum?: number;
  value?: number;
}

@Component({
  selector: 'pvf-tankmonitoring-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartData: IChartData[];
  @Input() filter: IFilterChartData;
  @Input() loading: boolean;
  @Input() title = '';
  @Input() numeralValueFormatter = '';
  @Input() asset: IAsset;

  @Output() updateChartData = new EventEmitter<IFilterChartData>();
  @Output() download = new EventEmitter();

  @ViewChild('dataRangeSelection', {static: false}) dataRangeSelection;

  public options: any;
  public chart: any;
  public range: {fromDate: number; toDate: number};
  public Highcharts = Highcharts;
  public rangeTranslation = 'range';

  constructor(public translateService: TranslateService) {
  }

  public ngOnInit() {
    this.translateService.get('SENSORTYPES.range').subscribe((result: string) => {
      this.rangeTranslation = result;
    });
  }

  public async ngOnChanges() {
    const filename = this.asset ? (this.asset.name) : 'Chart';
    this.options = {
      navigator: {
        enabled: true
      },
      time: {
        timezone: 'Europe/Brussels'
      },
      chart: {
        zoomType: 'xy',
      },
      title: {
        text: this.title
      },
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename,
        buttons: {
          contextButton: {
            menuItems: HIGHCHARTS_MENU_ITEMS
          }
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        crosshairs: true,
        shared: true,
      },
      yAxis: {
        min: 0,
        title: {
            text: ''
        },
        labels: {
            format: '{value}%',
        },
        plotLines: [{
          color: 'red',
          value: 10,
          width: '1',
          zIndex: 2
        }]
      },
      xAxis: {
        type: 'datetime'
      },
      plotOptions: {
        spline: {
            marker: {
                enabled: false
            }
        },
        series: {
          connectNulls: true,
          marker: {
            enabled: false
          }
        }
      },
      legend: {},
      series: []
    };

    if (this.chartData.length) {
      const FILL_LEVEL = this.chartData.filter(data => data.label === 'tank fill level')[0];
      const CONSUMPTION = this.chartData.filter(data => data.label === 'consumption')[0];
      if (this.filter.durationInHours > 24) {
        // AVG TANK FILL LEVEL
        if (FILL_LEVEL) {
          this.options.series.push({
            name: FILL_LEVEL.label,
            color: '#7A81E4',
            zIndex: 1,
            type: 'spline',
            showInLegend: (FILL_LEVEL.series.length) ? true : false,
            data: FILL_LEVEL.series.map((serie) => {
              return [
                serie.timestamp,
                isNullOrUndefined(serie.avg) ? null : parseFloat(serie.avg.toFixed(2))
              ];
            })
          });
        }
        // SUM CONSUMPTION LEVEL
        if (CONSUMPTION) {
          this.options.series.push({
            name: CONSUMPTION.label,
            color: '#3745AE',
            zIndex: 1,
            type: 'column',
            showInLegend: (CONSUMPTION.series.length) ? true : false,
            data: CONSUMPTION.series.map((serie) => {
              return [
                serie.timestamp,
                isNullOrUndefined(serie.sum) ? null : parseFloat(serie.sum.toFixed(2))
              ];
            })
          });
        }
      } else {
        // REAL TANK FILL LEVEL
        if (FILL_LEVEL) {
          this.options.series.push({
            name: FILL_LEVEL.label,
            color: '#7A81E4',
            zIndex: 1,
            type: 'spline',
            showInLegend: (FILL_LEVEL.series.length) ? true : false,
            data: FILL_LEVEL.series.map((serie) => {
              return [
                serie.timestamp,
                isNullOrUndefined(serie.value) ? null : parseFloat(serie.value.toFixed(2))
              ];
            })
          });
        }
        // REAL CONSUMPTION LEVEL
        if (CONSUMPTION) {
          this.options.series.push({
            name: CONSUMPTION.label,
            color: '#3745AE',
            zIndex: 1,
            type: 'column',
            showInLegend: (CONSUMPTION.series.length) ? true : false,
            data: CONSUMPTION.series.map((serie) => {
              return [
                serie.timestamp,
                isNullOrUndefined(serie.value) ? null : parseFloat(serie.value.toFixed(2))
              ];
            })
          });
        }
      }
    }

    try {
      this.chart = Highcharts.chart('chart-container', this.options);
    } catch (error) {
      this.options.series = [];
      this.chart = Highcharts.chart('chart-container', this.options);
      console.error(error);
    }
  }

  public filterInt(value: string) {
    if (/^(-|\+)?(\d+|Infinity)$/.test(value)) {
      return Number(value);
    }
    return NaN;
  }

  public intervalChanged(event) {
    this.updateChartData.emit({
      interval: event.value
    });
  }

  public dateRangeChanged(periodicDuration: PeriodicDuration) {
    const {interval, from, to} = periodicDuration;
    this.updateChartData.emit({
      interval,
      from,
      to
    });
  }

  getConsumptionsAndAverage(series: IChartSerie[], serieLength: number): {consumptions: number[]; average: number} {
    const consumptions = [];
    if (this.filter.durationInHours > 24) {
      series.forEach((serie: IChartSerie, index: number) => {
        if (index + 1 < serieLength) {
          const avgNext = parseFloat(series[index + 1].avg.toFixed(2));
          const consumption = avgNext - parseFloat(serie.avg.toFixed(2));
          if (consumption < 0) {
            consumptions.push(Math.abs(consumption));
          } else {
            consumptions.push(0);
          }
        }
      });
    } else {
      series.forEach((serie: IChartSerie, index: number) => {
        if (index + 1 < serieLength) {
          const next = parseFloat(series[index + 1].value.toFixed(2));
          const consumption = next - parseFloat(serie.value.toFixed(2));
          if (consumption < 0) {
            consumptions.push(Math.abs(consumption));
          } else {
            consumptions.push(0);
          }
        }
      });
    }
    return {
      consumptions,
      average: consumptions.reduce( ( p, c ) => p + c, 0 ) / consumptions.length
    };
  }

  downloadCSV() {
    this.chart.downloadCSV();
  }


}
