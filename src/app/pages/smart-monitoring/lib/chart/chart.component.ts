import {isNullOrUndefined} from 'util';
import {ISensorDefinition} from '../../../../models/sensor-definition.model';
import {PeriodicDuration} from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {IAsset} from 'src/app/models/asset.model';


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
}


enum ESensorColors {
  TEMPERATURE = 'red',
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
  selector: 'pvf-smartmonitoring-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
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

  public options: any;
  public chart: any;
  public range: {
    fromDate: number;
    toDate: number
  };
  public Highcharts = Highcharts;
  public rangeTranslation = 'range';
  public chartSettingsForAsset = {};

  constructor(public translateService: TranslateService) {
  }

  public ngOnInit() {
    this.translateService.get('SENSORTYPES.range').subscribe((result: string) => {
      this.rangeTranslation = result;
    });
  }

  public ngOnChanges() {
    this.chartSettingsForAsset = ((JSON.parse(window.localStorage.getItem('smartmonitoring:chart-settings')) || {})[this.asset.id] || {});
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
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'separator',
              'downloadCSV',
              'downloadXLS',
              'viewData'
            ]
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
          events: {
            legendItemClick: (event) => {
              const chartSettings = JSON.parse(window.localStorage.getItem('smartmonitoring:chart-settings')) || {};
              const chartSettingsForAsset = chartSettings[this.asset.id] || {};
              chartSettingsForAsset[event.target.userOptions.id] = {
                visible: !event.target.visible
              };
              chartSettings[this.asset.id] = chartSettingsForAsset;
              window.localStorage.setItem('smartmonitoring:chart-settings', JSON.stringify(chartSettings));
            }
          }
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
      this.chart = Highcharts.chart('chart-container', this.options);
    } catch (error) {
      this.options.series = [];
      this.options.lang = {
        noData: 'No data for the selected period'
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
    const color = randomColor({
      hue: ESensorColors[String(item.label).toUpperCase()]
    });
    if (this.filter.interval !== 'ALL') {
      if (!isNullOrUndefined(item.sensorDefinition)) {
        const sensorDefinition = item.sensorDefinition;
        if (sensorDefinition.aggregatedValues.sum) {
          const id = item.sensorId + '_sum';
          this.options.series.push({
            visible: (this.chartSettingsForAsset[id]) ? this.chartSettingsForAsset[id].visible : true,
            id,
            name: item.label + ' ' + 'sum',
            color,
            yAxis: this.getYAxisByLabel(item.label),
            zIndex: 1,
            type: sensorDefinition.chartType,
            showInLegend: (item.series.length) ? true : false,
            data: item.series.map((serie) => {
              if (serie.sum !== null) {
                return [serie.timestamp, parseFloat(serie.sum.toFixed(2))];
              }
            })
          });
        }
        if (sensorDefinition.aggregatedValues.avg) {
          const id = item.sensorId + '_avg';
          this.options.series.push({
            visible: (this.chartSettingsForAsset[id]) ? this.chartSettingsForAsset[id].visible : true,
            id,
            name: item.label + ' ' + 'avg',
            color,
            yAxis: this.getYAxisByLabel(item.label),
            zIndex: 1,
            type: sensorDefinition.chartType,
            showInLegend: (item.series.length) ? true : false,
            data: item.series.map((serie) => {
              if (serie.avg !== null) {
                return [serie.timestamp, parseFloat(serie.avg.toFixed(2))];
              }
            })
          });
        }
        if (sensorDefinition.aggregatedValues.max && sensorDefinition.aggregatedValues.min) {
          const id = item.sensorId + '_min-max';
          this.options.series.push({
            visible: (this.chartSettingsForAsset[id]) ? this.chartSettingsForAsset[id].visible : true,
            id,
            name: item.label + ' ' + this.rangeTranslation,
            color,
            type: 'arearange',
            yAxis: this.getYAxisByLabel(item.label),
            showInLegend: (item.series.length) ? true : false,
            lineWidth: 0,
            linkedTo: (sensorDefinition.aggregatedValues.avg || sensorDefinition.aggregatedValues.sum) ? ':previous' : null,
            fillOpacity: 0.3,
            zIndex: 0,
            marker: {
              enabled: false
            },
            data: item.series.map((serie) => {
              if (serie.min !== null && serie.max !== null) {
                return [serie.timestamp, parseFloat(serie.min.toFixed(2)), parseFloat(serie.max.toFixed(2))];
              }
            })
          });
        } else {
          if (sensorDefinition.aggregatedValues.max) {
            const id = item.sensorId + '_max';
            this.options.series.push({
              visible: (this.chartSettingsForAsset[id]) ? this.chartSettingsForAsset[id].visible : true,
              id,
              name: item.label + ' ' + 'max',
              color,
              yAxis: this.getYAxisByLabel(item.label),
              zIndex: 1,
              type: 'areaspline',
              showInLegend: (item.series.length) ? true : false,
              data: item.series.map((serie) => {
                return [serie.timestamp, parseFloat(serie.max.toFixed(2))];
              })
            });
          } else if (sensorDefinition.aggregatedValues.min) {
            const id = item.sensorId + '_min';
            this.options.series.push({
              visible: (this.chartSettingsForAsset[id]) ? this.chartSettingsForAsset[id].visible : true,
              id,
              name: item.label + ' ' + 'min',
              color,
              yAxis: this.getYAxisByLabel(item.label),
              zIndex: 1,
              type: 'areaspline',
              showInLegend: (item.series.length) ? true : false,
              data: item.series.map((serie) => {
                if (serie.min !== null) {
                  return [serie.timestamp, parseFloat(serie.min.toFixed(2))];
                }
              })
            });
          }
        }
      } else {

        // AVERAGE
        const avgId = item.sensorId + '_avg';
        this.options.series.push({
          visible: (this.chartSettingsForAsset[avgId]) ? this.chartSettingsForAsset[avgId].visible : true,
          id: avgId,
          name: item.label,
          color,
          yAxis: this.getYAxisByLabel(item.label),
          zIndex: 1,
          type: 'spline',
          showInLegend: (item.series.length) ? true : false,
          data: item.series.map((serie) => {
            if (serie.avg !== null) {
              return [serie.timestamp, parseFloat(serie.avg.toFixed(2))];
            }
          })
        });

        // MIN AND MAX
        const minMaxId = item.sensorId + '_min-max';
        this.options.series.push({
          visible: (this.chartSettingsForAsset[minMaxId]) ? this.chartSettingsForAsset[minMaxId].visible : true,
          id: minMaxId,
          name: item.label + ' ' + this.rangeTranslation,
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
            if (serie.min !== null && serie.max !== null) {
              return [serie.timestamp, parseFloat(serie.min.toFixed(2)), parseFloat(serie.max.toFixed(2))];
            }
          })
        });
      }
    } else {
      // REAL VALUES
      const id = item.sensorId;
      if (!isNullOrUndefined(item.sensorDefinition)) {
        this.options.series.push({
          visible: (this.chartSettingsForAsset[id]) ? this.chartSettingsForAsset[id].visible : true,
          id,
          name: item.label,
          color,
          yAxis: this.getYAxisByLabel(item.label),
          zIndex: 1,
          type: item.sensorDefinition.chartType,
          showInLegend: (item.series.length) ? true : false,
          data: item.series.map((serie) => {
            if (serie.value !== null) {
              return [serie.timestamp, parseFloat(serie.value.toFixed(2))];
            }
          })
        });
      } else {
        this.options.series.push({
          visible: (this.chartSettingsForAsset[id]) ? this.chartSettingsForAsset[id].visible : true,
          id,
          name: item.label,
          color,
          yAxis: this.getYAxisByLabel(item.label),
          zIndex: 1,
          type: 'spline',
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
