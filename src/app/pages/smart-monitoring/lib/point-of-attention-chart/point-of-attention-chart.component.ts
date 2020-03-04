import {isNullOrUndefined} from 'util';
import {IPointOfAttention} from './../../../../models/point-of-attention.model';
import {ISensorDefinition} from '../../../../models/sensor-definition.model';
import {PeriodicDuration} from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { HIGHCHARTS_MENU_ITEMS } from 'src/app/shared/global';

declare global {
  interface Window {
    moment: any;
  }
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


enum ESensorColors {
  TEMPERATURE = 'orange',
  HUMIDITY = 'blue',
  BATTERY = 'monochrome'
}

interface IChartData {
  label: string;
  sensorId: string;
  sensorTypeId: string;
  sensorDefinition: ISensorDefinition;
  series: IChartSerie[];
}

interface IChartSerie {
  timestamp: number;
  avg?: number;
  min?: number;
  max?: number;
  value?: number;
  sum?: number;
}

@Component({
  selector: 'pvf-smartmonitoring-point-of-attention-chart',
  templateUrl: './point-of-attention-chart.component.html',
  styleUrls: ['./point-of-attention-chart.component.scss']
})
export class PointOfAttentionChartComponent implements OnInit, OnChanges {
  @Input() chartData: IChartData[];
  @Input() filter: IFilterChartData;
  @Input() loading: boolean;
  @Input() numeralValueFormatter = '';
  @Input() colors = [
    '#5C2D91', '#866C9D',
    '#B22E87', '#C386A9',
    '#EA4D71', '#F3A7B1',
    '#FF835B', '#9E6450',
    '#F9F871', '#C0BC84',
    '#9BDE7E', '#7FA06F'
  ];

  @Input() pointOfAttention: IPointOfAttention;

  @Output() updateChartData = new EventEmitter<IFilterChartData>();
  @Output() download = new EventEmitter();

  @ViewChild('dataRangeSelection', {
    static: false
  }) dataRangeSelection;

  public options: any;
  public chart: any;
  public range: {
    fromDate: number;
    toDate: number
  };
  public Highcharts = Highcharts;
  public chartSettingsForPointOfAttention = {};

  constructor(
    public translateService: TranslateService
  ) {
  }

  public ngOnInit() {
  }

  public ngOnChanges() {
    const filename = this.pointOfAttention ? (this.pointOfAttention.name) : 'Chart';
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
        text: filename
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
          connectNulls: true,
          showInNavigator: true,
          marker: {
            enabled: false
          },
        }
      },
      legend: {},
      series: []
    };

    for (const data of this.chartData) {
      this.addYAxisOption((data.series || []).length, data.label);
      this.addYAxisValues(data);
    }

    try {
      this.chart = Highcharts.chart('point-of-attention-chart-container', this.options);
    } catch (error) {
      this.options.series = [];
      this.options.lang = {
        noData: this.translateService.instant('GENERAL.NO_DATA_FOR_SELECTED_PERIOD')
      };
      this.chart = Highcharts.chart('point-of-attention-chart-container', this.options);
      console.error(error);
    }
  }


  private addYAxisOption(lengthOfSerie: number, label: string) {
    const axisOpposite = this.options.yAxis.length % 2 > 0;
    let shouldAddYAxis = false;

    if (lengthOfSerie > 0) {
      shouldAddYAxis = true;
      if (this.options.yAxis.length > 0) {
        shouldAddYAxis = !this.options.yAxis.some((e) => {
          return e.title.text === label;
        });
      }
    }

    if (shouldAddYAxis) {
      this.options.yAxis.push({
        opposite: axisOpposite,
        showEmpty: false,
        title: {
          text: label
        }
      });
    }
  }

  private addYAxisValues(item: IChartData) {
    const color = randomColor({
      hue: ESensorColors[String(item.label).toUpperCase()]
    });
    if (this.filter.interval) {
      this.options.series.push({
        name: item.label,
        color,
        yAxis: this.getYAxisByLabel(item.label),
        type: 'spline',
        showInLegend: (item.series.length) ? true : false,
        data: item.series.map((serie) => {
          return [serie.timestamp,
            isNullOrUndefined(serie.value) ? null : parseFloat(serie.value.toFixed(2))];
        })
      });
    }
  }

  getYAxisByLabel(label) {
    let result;
    for (let i = 0; i < this.options.yAxis.length; i++) {
      if (this.options.yAxis[i].title.text.toUpperCase() === label.toUpperCase()) {
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
    const {
      interval,
      from,
      to
    } = periodicDuration;
    this.updateChartData.emit({
      interval,
      from,
      to
    });
  }

  downloadCSV() {
    this.chart.downloadCSV();
  }

}
