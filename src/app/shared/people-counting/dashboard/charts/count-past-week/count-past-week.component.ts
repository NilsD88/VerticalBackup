import { isNullOrUndefined } from 'util';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { TranslateService } from '@ngx-translate/core';
import { ILeafColors } from '../../leaf.model';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { Router } from '@angular/router';

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
  selector: 'pvf-peoplecounting-count-past-week',
  templateUrl: './count-past-week.component.html',
  styleUrls: ['./count-past-week.component.scss']
})
export class CountPastWeekComponent implements OnChanges, OnInit {

  @Input() leafs: IPeopleCountingLocation[];
  @Input() leafColors: ILeafColors[];
  @Input() leafUrl = '/private/walkingtrail/trail';
  @Input() loading = false;
  @Input() loadingError = false;

  @Output() decrease: EventEmitter <null> = new EventEmitter();
  @Output() increase: EventEmitter <null> = new EventEmitter();
  @Output() wantTryAgain: EventEmitter <null> = new EventEmitter();

  public chart: any;
  public chartOptions: any;
  public locale: string;

  constructor(
    private translateService: TranslateService,
    private router: Router,
  ) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.leafs) {
      if (changes.leafs.currentValue && changes.leafs.currentValue !== changes.leafs.previousValue) {
        this.updateChart();
      }
    }
  }

  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale);
    window.moment = moment;
    mTZ();
    this.initChartOptions();
    this.initChart();
  }

  private initChartOptions() {

    const instance = this;

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
      yAxis: [{
        title: {
          text: ''
        },
        visible: true
      }],
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
          },
          point: {
            events: {
              click: function (event) {
                const leafId = this.series.userOptions.id;
                if (!isNullOrUndefined(leafId)) {
                  instance.router.navigateByUrl(`${instance.leafUrl}/${leafId}`);
                }
              }
            }
          },
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
    this.chartOptions.series = [];
    this.chartOptions.legend = {};

    if ((this.leafs || []).length < 1) {
      return;
    }

    for (const leaf of this.leafs) {
      const color = (this.leafColors.find(element => element.id === leaf.id) || {})['color'] || randomColor();
      this.chartOptions.series.push({
        name: leaf.name,
        id: !(leaf.children || []).length ? leaf.id : null,
        color,
        type: 'spline',
        data: leaf.series.map((serie) => {
          return [serie.timestamp, serie.valueIn ? parseFloat(serie.valueIn.toFixed(2)) : null];
        })
      });
    }

    try {
      this.chart = Highcharts.chart('count-past-week-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chartOptions.legend = {};
      this.chart = Highcharts.chart('count-past-week-chart-container', this.chartOptions);
      console.log(error);
    }
  }
}

