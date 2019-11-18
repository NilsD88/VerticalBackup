import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import {
  IWalkingTrailLocation
} from 'src/app/models/walkingtrail/location.model';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { ILeafColors } from 'src/app/models/peoplecounting/leaf.model';
import { TranslateService } from '@ngx-translate/core';

declare global {
  interface Window {
    moment: any;
  }
}


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

@Component({
  selector: 'pxs-peoplecounting-dashboard-count-past-week',
  templateUrl: './count-past-week.component.html',
  styleUrls: ['./count-past-week.component.scss']
})
export class CountPastWeekComponent implements OnChanges, OnInit {

  @Input() leafs: IWalkingTrailLocation[];
  @Input() leafColors: ILeafColors[];
  @Output() decrease: EventEmitter <null> = new EventEmitter();
  @Output() increase: EventEmitter <null> = new EventEmitter();

  public chart: any;
  public chartOptions: any;
  public locale: string;

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.updateChart();
    }
  }

  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale);
    window.moment = moment;
    mTZ();

    this.initChartOptions();
    this.initChart();
    this.updateChart();
  }

  private initChartOptions() {

    Highcharts.setOptions({
      lang: {
        weekdays: moment.weekdays(),
        shortWeekdays: moment.weekdaysShort()
      }
    });

    this.chartOptions = {
      time: {
        timezone: 'Europe/Brussels'
      },
      chart: {
        zoomType: 'xy',
        height: 400,
      },
      title: {
        text: ''
      },
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'count-past-week',
        buttons: {
          increaseButton: {
            text: 'Increase',
            onclick: () => {
              this.increase.emit();
            },
          },
          decreaseButton: {
            text: 'Decrease',
            onclick: () => {
              this.decrease.emit();
            },
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
      yAxis: [],
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%a'
        }
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
      series: [],
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('count-past-week-chart-container', this.chartOptions);
    } catch (error) {
      console.log(error);
    }
  }

  private updateChart() {
    this.chartOptions.yAxis = [];
    this.chartOptions.series = [];
    this.chartOptions.legend = {};

    if ((this.leafs || []).length < 1) {
      return;
    }

    let counter = 0;
    for (const leaf of this.leafs) {
      this.chartOptions.yAxis.push({
        title: {
          text: 'Trail'
        },
        visible: false
      });
      const color = (this.leafColors.find(element => element.id === leaf.id) || {})['color'] || randomColor();
      this.chartOptions.series.push({
        name: leaf.name,
        color,
        type: 'spline',
        yAxis: counter++,
        data: leaf.series.map((serie) => {
          return [serie.timestamp, parseFloat(serie.sum.toFixed(2))];
        })
      });
    }

    try {
      this.chart = Highcharts.chart('count-past-week-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.yAxis = [];
      this.chartOptions.series = [];
      this.chartOptions.legend = {};
      this.chart = Highcharts.chart('count-past-week-chart-container', this.chartOptions);
      console.log(error);
    }
  }
}

