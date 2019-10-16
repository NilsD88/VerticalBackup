import { PeriodicDuration } from '../../../../../../projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import {Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { NgxDrpOptions } from 'ngx-mat-daterange-picker';
import { IAsset } from 'src/app/models/asset.model';


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
const randomColor = require('randomcolor');

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
  label: string;
  avg?: number;
  min?: number;
  max?: number;
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
  @Input() height = 700;
  @Input() title = '';
  @Input() numeralValueFormatter = '';
  @Input() asset: IAsset;
  @Input() colors = [
    '#5C2D91', '#866C9D',
    '#B22E87', '#C386A9',
    '#EA4D71', '#F3A7B1',
    '#FF835B', '#9E6450',
    '#F9F871', '#C0BC84',
    '#9BDE7E', '#7FA06F'
  ];

  @Output() updateChartData = new EventEmitter<IFilterChartData>();
  @Output() download = new EventEmitter();

  @ViewChild('dataRangeSelection') dataRangeSelection;

  public options: any;
  public chart: any;
  public range: {fromDate: number; toDate: number};
  public Highcharts = Highcharts;

  constructor(public translateService: TranslateService) {
  }

  public ngOnInit() {
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
        height: this.height,
      },
      title: {
        text: this.title
      },
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename
      },
      credits: {
        enabled: false
      },
      colors: this.colors,
      tooltip: {
        crosshairs: true,
        shared: true,
      },
      yAxis: [],
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
          marker: {
            enabled: false
          }
        }
      },
      legend: {},
      series: []
    };

    const chartDataPromises = [];
    const rangeTranslation: string = await new Promise((resolve) => {
      this.translateService.get('SENSORTYPES.range').subscribe((result) => {
        resolve(result);
      });
    });


    this.chartData.forEach(async (item: IChartData) => {
      console.log(item.label);
      if (item.label !== 'tank fill level') {
        return;
      }
      chartDataPromises.push(new Promise(async (resolveChartDataPromise) => {
        const labelTranslation: string = await new Promise((resolve) => {
          this.translateService.get('SENSORTYPES.' + item.label).subscribe((result: string) => {
            resolve(result);
          });
        });

        const serieLength = item.series.length;

        const {consumptions, average} = this.getConsumptionsAndAverage(item.series, serieLength);
        console.log([...consumptions], average);
        this.addYAxisOption(serieLength, labelTranslation, average);
        this.addYAxisValues(item, labelTranslation, rangeTranslation, serieLength, consumptions);
        resolveChartDataPromise();
      }));
    });

    await Promise.all(chartDataPromises);
    try {
      this.chart = Highcharts.chart('chart-container', this.options);
    } catch (error) {
      this.options.series = [];
      this.chart = Highcharts.chart('chart-container', this.options);
      console.log(error);
    }
  }

  public filterInt(value: string) {
    if (/^(-|\+)?(\d+|Infinity)$/.test(value)) {
      return Number(value);
    }
    return NaN;
  }

  private addYAxisOption(lengthOfSerie: number, labelTranslation: string, average: number) {
    const axisOpposite = this.options.yAxis.length % 2 > 0;
    let shouldAddYAxis = false;

    if (lengthOfSerie > 0) {
      shouldAddYAxis = true;
      if (this.options.yAxis.length > 0) {
        shouldAddYAxis = !this.options.yAxis.some((e) => {
          return e.title.text === labelTranslation;
        });
      }
    }

    if (shouldAddYAxis) {
      this.options.yAxis.push({
        min: 0,
        max: 100,
        opposite: axisOpposite,
        showEmpty: false,
        title: {
          text: labelTranslation
        },
        plotLines: [{
            color: 'red',
            value: average,
            width: '1',
            zIndex: 2 // To not get stuck below the regular plot lines
        }]
      });
    }
  }

  private addYAxisValues(item: IChartData, labelTranslation: string, rangeTranslation: string, serieLength: number, consumptions: number[]) {
    const color = randomColor();

    if (this.filter.durationInHours > 24) {
      // AVERAGE
      this.options.series.push({
        name: labelTranslation,
        color,
        yAxis: this.getYAxisByLabel(item.label),
        zIndex: 1,
        type: 'spline',
        showInLegend: (item.series.length) ? true : false,
        data: item.series.map((serie) => {
          let label = this.filterInt(serie.label);
          if (isNaN(label)) {
            console.warn('Unable to perse timestamp for chart, using default value of 0');
            label = 0;
          }
          return [label, parseFloat(serie.avg.toFixed(2))];
        })
      });

      this.options.series.push({
        name: labelTranslation + ' consumption',
        color,
        yAxis: this.getYAxisByLabel(item.label),
        zIndex: 1,
        type: 'column',
        showInLegend: (item.series.length) ? true : false,
        data: item.series.map((serie, index) => {
          let label = this.filterInt(serie.label);
          if (isNaN(label)) {
            console.warn('Unable to perse timestamp for chart, using default value of 0');
            label = 0;
          }
          return [label, consumptions[index]];
        })
      });
      // MIN AND MAX
      /*
      this.options.series.push({
        name: labelTranslation + ' ' + rangeTranslation,
        color,
        type: 'arearange',
        yAxis: this.getYAxisByLabel(item.label),
        showInLegend: (item.series.length) ? true : false,
        lineWidth: 0,
        linkedTo: ':previous',
        fillOpacity: 0.3,
        zIndex: 0,
        marker: {
          enabled: false
        },
        data: item.series.map((serie) => {
          let label = this.filterInt(serie.label);
          if (isNaN(label)) {
            console.warn('Unable to perse timestamp for chart, using default value of 0');
            label = 0;
          }
          return [label, parseFloat(serie.min.toFixed(2)), parseFloat(serie.max.toFixed(2))];
        })
      });
      */
    } else {
      // REAL VALUES
      console.log('more than 24 hours');
      this.options.series.push({
        name: labelTranslation,
        color,
        yAxis: this.getYAxisByLabel(item.label),
        zIndex: 1,
        type: 'spline',
        showInLegend: (item.series.length) ? true : false,
        data: item.series.map((serie) => {
          let label = this.filterInt(serie.label);
          if (isNaN(label)) {
            console.warn('Unable to perse timestamp for chart, using default value of 0');
            label = 0;
          }
          console.log({...serie});
          return [label, parseFloat(serie.value.toFixed(2))];
        })
      });
    }
  }

  getYAxisByLabel(label) {
    let result;
    for ( let i = 0; i < this.options.yAxis.length; i++) {
      if ( this.options.yAxis[i].title.text.toUpperCase() === label.toUpperCase()) {
        result = i;
      }
    }
    return result;
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
    return {
      consumptions,
      average: consumptions.reduce( ( p, c ) => p + c, 0 ) / consumptions.length
    };
  }

  downloadCSV() {
    this.chart.downloadCSV();
  }
  

}