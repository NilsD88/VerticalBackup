import {isNullOrUndefined} from 'util';
import {ISensorDefinition} from '../../../../models/sensor-definition.model';
import {PeriodicDuration} from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {IAsset} from 'src/app/models/asset.model';
import { HIGHCHARTS_MENU_ITEMS, SENSOR_TYPE_COLORS } from 'src/app/shared/global';


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
  sensorTypeName: string;
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
  selector: 'pvf-peoplecounting-asset-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class PeopleCountingAssetChartComponent implements OnInit, OnChanges {
  @Input() chartData: IChartData[];
  @Input() filter: IFilterChartData;
  @Input() loading: boolean;
  @Input() title = '';
  @Input() numeralValueFormatter = '';
  @Input() colors = [
    '#5C2D91', '#866C9D',
    '#B22E87', '#C386A9',
    '#EA4D71', '#F3A7B1',
    '#FF835B', '#9E6450',
    '#F9F871', '#C0BC84',
    '#9BDE7E', '#7FA06F'
  ];

  @Input() asset: IAsset;

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
  public rangeTranslation = 'range';

  constructor(public translateService: TranslateService) {
  }

  public ngOnInit() {
    this.translateService.get('SENSORTYPES.range').subscribe((result: string) => {
      this.rangeTranslation = result;
    });
  }

  public ngOnChanges() {
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
      this.addYAxisOption((data.series || []).length, data.label);
      this.addYAxisValues(data);
    }

    try {
      this.chart = Highcharts.chart('chart-container', this.options);
    } catch (error) {
      this.options.series = [];
      this.options.lang = {
        noData: this.translateService.instant('GENERAL.NO_DATA_FOR_SELECTED_PERIOD')
      };
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
    const direction = (item.sensorDefinition || {}).inOutType;
    const color = SENSOR_TYPE_COLORS[item.sensorTypeName] || randomColor();
    if (this.filter.interval !== 'ALL') {
        if (direction === 'BOTH') {
          // IN: SUM
          const inSumId = item.sensorId + 'in_sum';
          this.options.series.push({
            id: inSumId,
            name: item.label + ' (IN)',
            color,
            yAxis: this.getYAxisByLabel(item.label),
            zIndex: 1,
            type: 'column',
            showInLegend: (item.series.length) ? true : false,
            data: item.series.map((serie) => {
              return [
                serie.timestamp,
                isNullOrUndefined(serie.sum) ? null : parseFloat(serie.sum.toFixed(2)) / 2
              ];
            })
          });

          // OUT: SUM
          const outSumId = item.sensorId + 'out_sum';
          this.options.series.push({
            id: outSumId,
            name: item.label + ' (OUT)',
            color,
            yAxis: this.getYAxisByLabel(item.label),
            zIndex: 1,
            type: 'column',
            showInLegend: (item.series.length) ? true : false,
            data: item.series.map((serie) => {
              return [
                serie.timestamp,
                isNullOrUndefined(serie.sum) ? null : parseFloat(serie.sum.toFixed(2)) / 2
              ];
            })
          });
        } else {

          // SUM
          const sumId = item.sensorId + '_sum';
          this.options.series.push({
            id: sumId,
            name: direction ? `${item.label} (${direction})` : `${item.label}`,
            color,
            yAxis: this.getYAxisByLabel(item.label),
            zIndex: 1,
            type: 'column',
            showInLegend: (item.series.length) ? true : false,
            data: item.series.map((serie) => {
              return [
                serie.timestamp,
                isNullOrUndefined(serie.sum) ? null : parseFloat(serie.sum.toFixed(2))
              ];
            })
          });
        }
    } else {
      // REAL VALUES
      const id = item.sensorId;
      if (direction === 'BOTH') {
        // IN
        const inValueId = item.sensorId + 'in_value';
        this.options.series.push({
          id: inValueId,
          name: item.label + ' (IN)',
          color,
          yAxis: this.getYAxisByLabel(item.label),
          zIndex: 1,
          type: 'column',
          showInLegend: (item.series.length) ? true : false,
          data: item.series.map((serie) => {
            if (!isNullOrUndefined(serie.value)) {
              return [serie.timestamp, parseFloat(serie.value.toFixed(2)) / 2];
            }
          })
        });

        // OUT
        const outValueId = item.sensorId + 'out_value';
        this.options.series.push({
          id: outValueId,
          name: item.label + ' (OUT)',
          color,
          yAxis: this.getYAxisByLabel(item.label),
          zIndex: 1,
          type: 'column',
          showInLegend: (item.series.length) ? true : false,
          data: item.series.map((serie) => {
            if (!isNullOrUndefined(serie.value)) {
              return [serie.timestamp, parseFloat(serie.value.toFixed(2)) / 2];
            }
          })
        });
      } else {
        this.options.series.push({
          id,
          name: item.label,
          color,
          yAxis: this.getYAxisByLabel(item.label),
          zIndex: 1,
          type: 'column',
          showInLegend: (item.series.length) ? true : false,
          data: item.series.map((serie) => {
            if (!isNullOrUndefined(serie.value)) {
              return [serie.timestamp, parseFloat(serie.value.toFixed(2))];
            }
          })
        });
      }
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
